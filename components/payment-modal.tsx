import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { BiCloudUpload } from "react-icons/bi";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  onSuccess?: () => void;
}

type VerificationStatus = "idle" | "verifying" | "success" | "error";

interface ErrorState {
  message: string;
  details?: {
    expectedAmount?: number;
    actualAmount?: number;
    expectedAccount?: string;
    actualAccount?: string;
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  amount,
  onSuccess,
}: PaymentModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<any>(null);

  const fetchQRCode = async () => {
    setIsLoadingQR(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          amount: amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoadingQR(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSlip = async () => {
    if (!selectedFile || !session?.accessToken) return;

    setVerificationStatus("verifying");
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("orderId", orderId);
    formData.append("expectedAmount", amount.toString());

    try {
      const response = await fetch("/api/payments/verify-slip", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setVerificationStatus("error");
        setError({
          message: result.message,
          details: result.error,
        });
        return;
      }

      setVerificationStatus("success");
      setVerificationDetails(result.details);
      onSuccess?.();

      // Close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        router.push('/my-order')
      }, 3000);
    } catch (error) {
      setVerificationStatus("error");
      setError({
        message: "Failed to verify payment slip. Please try again.",
      });
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="mt-4 p-3 rounded-lg bg-default-100 flex items-center justify-center gap-2">
            <Spinner size="sm" />
            <span>Verifying payment slip...</span>
          </div>
        );

      case "error":
        return (
          error && (
            <div className="mt-4 p-4 rounded-lg bg-danger-50 border border-danger-200 text-danger-700">
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">✗</span>
                <div className="flex-1">
                  <p className="font-medium">{error.message}</p>
                  {error.details && (
                    <div className="mt-2 text-sm space-y-1">
                      {error.details.expectedAmount && (
                        <p>
                          Expected amount: ฿
                          {formatNumberWithComma(error.details.expectedAmount)}
                          <br />
                          Actual amount: ฿
                          {formatNumberWithComma(
                            error.details.actualAmount || 0
                          )}
                        </p>
                      )}
                      {error.details.expectedAccount && (
                        <p>Payment was sent to wrong account number</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        );

      case "success":
        return (
          <div className="mt-4 p-4 rounded-lg bg-success-50 border border-success-200 text-success-700">
            <div className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <div className="flex-1">
                <p className="font-medium">Payment verified successfully</p>
                {verificationDetails && (
                  <div className="mt-2 text-sm space-y-1">
                    <p>
                      Amount: ฿
                      {formatNumberWithComma(verificationDetails.amount)}
                    </p>
                    <p>From: {verificationDetails.sender_name}</p>
                    <p>Bank: {verificationDetails.sender_bank}</p>
                    <p>Time: {verificationDetails.transaction_time}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setVerificationStatus("idle");
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && session?.accessToken) {
      fetchQRCode();
    }
  }, [isOpen, session?.accessToken]);

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">QR Payment</h3>
          <p className="text-default-500 text-sm">
            Scan QR code to pay {formatNumberWithComma(amount)}
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            {/* QR Code Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-default-50 p-4 rounded-xl w-full max-w-[300px] mx-auto">
                {isLoadingQR ? (
                  <div className="aspect-square w-full flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : qrCode ? (
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img
                      src={qrCode}
                      alt="QR Payment"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full flex items-center justify-center text-default-400 text-center px-4">
                    Failed to load QR code
                  </div>
                )}
              </div>
              <Button
                color="primary"
                variant="light"
                onPress={fetchQRCode}
                isLoading={isLoadingQR}
                className="w-full max-w-[300px]"
              >
                Refresh QR Code
              </Button>
              {renderVerificationStatus()}
            </div>

            {/* Upload Slip Section */}
            <div className="flex flex-col gap-4 w-full max-w-[300px] mx-auto">
              <div
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 aspect-square w-full 
                  ${previewUrl ? "border-primary" : "border-default-300"}
                  ${verificationStatus === "error" ? "border-danger" : ""}
                  ${verificationStatus === "success" ? "border-success" : ""}
                `}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="slip-upload"
                />
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Payment slip preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      className="absolute top-2 right-2"
                      onPress={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="slip-upload"
                    className="cursor-pointer flex flex-col items-center gap-2 text-default-600 h-full justify-center"
                  >
                    <BiCloudUpload size={48} />
                    <p className="text-center">
                      Click or drag payment slip here
                    </p>
                    <p className="text-sm text-default-400 text-center">
                      Supports: JPG, PNG (Max 5MB)
                    </p>
                  </label>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            className="flex-1"
            isDisabled={verificationStatus === "verifying"}
          >
            {verificationStatus === "success" ? "Close" : "Cancel"}
          </Button>
          <Button
            color="primary"
            onPress={handleUploadSlip}
            isDisabled={
              !selectedFile ||
              verificationStatus === "verifying" ||
              verificationStatus === "success"
            }
            isLoading={verificationStatus === "verifying"}
            className="flex-1"
          >
            {verificationStatus === "error" ? "Try Again" : "Verify Payment"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
