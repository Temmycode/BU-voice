export default function ProfilePicture({ imageUrl }: { imageUrl: string }) {
  return (
    // <div className="rounded-full p-2 bg-orange">
    <img
      className="w-12 h-12 rounded-full object-cover bg-white-300 p-2 shadow-xl shadow-[#0000003a]"
      src={imageUrl}
    />
    // </div>
  );
}
