export const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative mt-4">
    <input
      type={type}
      name={name}
      placeholder=" "
      value={value}
      onChange={onChange}
      required
      className="
        peer w-full px-4 pt-6 pb-2
        bg-white/60 border border-gray-300
        rounded-xl focus:outline-none
        focus:ring-2 focus:ring-[#00A877]
        focus:border-[#00A877]
        transition-all
      "
    />
    <label className="
      absolute left-4 top-2 text-sm text-gray-500
      peer-placeholder-shown:top-4
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-focus:top-2
      peer-focus:text-sm
      peer-focus:text-[#00A877]
      transition-all duration-200
    ">
      {label}
    </label>
  </div>
);
