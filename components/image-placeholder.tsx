interface Props {
  name: string;
  classNames: string;
}

export default function ImagePlaceholder({ name, classNames }: Props) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gray-200 ${classNames}`}
    >
      <span className="text-gray-500 text-lg font-semibold">{name}</span>
    </div>
  );
}
