export default function UnsubscribeConfirmedPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="text-5xl mb-4">&#9993;</div>
        <h1 className="text-2xl font-semibold text-white mb-2">You&apos;ve been unsubscribed</h1>
        <p className="text-[#8a8f98]">
          You won&apos;t receive any more emails from Weekly Alpha.
          If this was a mistake, you can re-subscribe anytime.
        </p>
      </div>
    </div>
  );
}
