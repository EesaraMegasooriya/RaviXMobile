import { Link } from 'react-router-dom';
export default function ShopNot() {
  return <main className="min-h-screen bg-[#05080B] px-6 pb-20 pt-40 text-center text-white">
    <p className="text-cyan-400">404</p>
    <h1 className="my-6 text-4xl font-bold">Page not found</h1>
    <p className="mb-8 text-gray-400">The page you requested does not exist.</p>
    <Link to="/shop" className="rounded-full bg-cyan-400 px-8 py-3 font-semibold text-black">Browse the shop</Link>
  </main>;
}
