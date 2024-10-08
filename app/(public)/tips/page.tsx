import { tips } from "@/data/tips";
import { Button } from "@nextui-org/button";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { FaArrowRightLong } from "react-icons/fa6";

export default function TipsPage() {
  return (
    <div className="mb-40">
      <h3 className="font-bold text-2xl leading-relaxed mb-5">Tips</h3>
      <div className="flex flex-col md:flex-row flex-wrap gap-5 justify-center">
        {tips.map((tip) => (
          <Card
            key={tip.id}
            isFooterBlurred
            className="w-full md:w-2/5 h-[350px]"
          >
            <Image
              removeWrapper
              alt={tip.title}
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
              src={tip.image}
            />
            <CardFooter className="absolute bg-white/60 bottom-0 border-t-1 border-zinc-100/50 z-10">
              <div className="flex flex-col gap-2 w-full">
                <div>
                  <p className="text-black text-lg font-bold">{tip.title}</p>
                  <p className="text-black">{tip.description}</p>
                </div>
                <div className="flex justify-end mt-2">
                  <Button color="primary" radius="full" className="w-1/2">
                    <div className="flex items-center gap-2">
                      <p>Read more</p>
                      <FaArrowRightLong size={15} />
                    </div>
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
