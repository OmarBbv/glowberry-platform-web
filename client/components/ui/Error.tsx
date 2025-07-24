export const Error = ({
  message = 'Bir hata oluştu. Lütfen tekrar deneyin.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh text-red-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.105-2.055L13.105 4.945c-.553-.915-1.658-.915-2.211 0L3.977 16.945c-.553.915.051 2.055 1.105 2.055z"
        />
      </svg>
      <p className="text-lg font-medium text-center">{message}</p>
    </div>
  );
};
