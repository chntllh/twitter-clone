const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center min-h-screen bg-opacity-20 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white" />
    </div>
  );
}

export default LoadingSpinner;
