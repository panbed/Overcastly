export default function PageNotFound() {
  return (
    <div className="flex flex-col justify-center align-middle items-center absolute inset-0">
      <img src="/logo_hurricane.svg" className="invert w-32 animate-spin"/>
      <p className="font-semibold">Page not found...</p>
    </div>
  )
}