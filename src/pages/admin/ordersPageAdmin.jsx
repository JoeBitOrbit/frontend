import axios from "axios";
import { useEffect, useState } from "react";
import Paginator from "../../components/paginator";
import toast from "react-hot-toast";
import { getItem } from "../../utils/safeStorage.js";

export default function OrdersPageAdmin() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [limit, setLimit] = useState(10);
	const [popupVisible, setPopupVisible] = useState(false);
	const [clickedOrder, setClickedOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("pending"); // pending, completed, cancelled
    const [orderNotes, setOrderNotes] = useState("");

	useEffect(() => {
		if (loading) {
				axios
				.get(
					import.meta.env.VITE_BACKEND_URL +
						"/api/orders/" +
						page +
						"/" +
						limit,
					{
						headers: {
							Authorization: `Bearer ${getItem("token")}`,
						},
					}
				)
				.then((res) => {
					setOrders(res.data.orders);
					setTotalPages(res.data.totalPages);
					setLoading(false);
				})
				.catch((err) => {
					toast.error('Failed to load orders');
					setLoading(false);
				});
		}
	}, [loading, page, limit]);

		return (
		<div className="w-full h-full flex flex-col justify-between">
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="text-gray-500">Loading orders...</div>
				</div>
			) : orders.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64">
					<div className="text-6xl mb-4">📦</div>
					<h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
					<p className="text-gray-500">Orders will appear here once customers start purchasing</p>
				</div>
			) : (
				<>
			<table className="w-full border-[3px]">
				<thead>
					<tr>
						<th className="p-[10px]">Order ID</th>
						<th className="p-[10px]">email</th>
						<th className="p-[10px]">name</th>
						<th className="p-[10px]">Address</th>
						<th className="p-[10px]">Phone</th>
						<th className="p-[10px]">Status</th>
						<th className="p-[10px]">Date</th>
						<th className="p-[10px]">Total</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((order, index) => {
						return (
							<tr
								key={index}
								className="border-b-[1px] hover:bg-red-50 cursor-pointer"
								onClick={() => {
                                    setOrderStatus(order.status);
                                    setOrderNotes(order.notes);
									setClickedOrder(order);
									setPopupVisible(true);
								}}
							>
								<td className="p-[10px]">{order.orderID}</td>
								<td className="p-[10px]">{order.email}</td>
								<td className="p-[10px]">{order.name}</td>
								<td className="p-[10px]">{order.address}</td>
								<td className="p-[10px]">{order.phone}</td>
								<td className="p-[10px]">{order.status}</td>
								<td className="p-[10px]">
									{new Date(order.date).toLocaleDateString()}
								</td>
								<td className="p-[10px] text-end">
									{order.total ? order.total.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}) : 'N/A'}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			</>
			)}
			\
			{popupVisible && clickedOrder && (
				<div className="fixed top-0 left-0 w-full h-full bg-[#00000080] flex justify-center items-center z-50 p-4">
					<div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-y-auto shadow-2xl">
						{/* Header with Actions */}
						<div className="sticky top-0 bg-gradient-to-r from-[#8C0009] to-[#BE0108] text-white p-6 flex justify-between items-center">
							<h2 className="text-3xl font-bold">Order Details</h2>
							<div className="flex gap-3">
								{(orderStatus !== clickedOrder.status || orderNotes !== clickedOrder.notes) && (
									<button 
										className="px-6 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
										onClick={async () => {
											setPopupVisible(false);
											try {
												await axios.put(
													import.meta.env.VITE_BACKEND_URL + "/api/orders/" + clickedOrder._id,
													{
														status: orderStatus,
														notes: orderNotes
													},
													{
														headers: {
															Authorization: `Bearer ${getItem("token")}`,
														},
													}
												);
												toast.success("Order updated successfully");
												setLoading(true);
											} catch (err) {
												toast.error("Failed to update order");
											}
										}}
									>
										✓ Save Changes
									</button>
								)}
								<button 
									className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
									onClick={async () => {
										if (!confirm('Delete this order permanently?')) return;
										try {
											await axios.delete(
												import.meta.env.VITE_BACKEND_URL + "/api/orders/" + clickedOrder._id,
												{ headers: { Authorization: `Bearer ${getItem("token")}` } }
											);
											toast.success('Order deleted');
											setPopupVisible(false);
											setLoading(true);
										} catch (err) {
											toast.error('Failed to delete order');
										}
									}}
								>
									Delete
								</button>
								<button 
									className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
									onClick={() => setPopupVisible(false)}
								>
									Close
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="p-8 space-y-8">
							{/* Customer Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<h3 className="text-lg font-bold text-gray-900 border-b-2 border-red-700 pb-2">Customer Info</h3>
									<div className="space-y-3">
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
											<p className="text-lg font-semibold text-gray-900">{clickedOrder.orderID}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
											<p className="text-lg text-gray-900">{clickedOrder.name}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
											<p className="text-lg text-blue-600 truncate">{clickedOrder.email}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
											<p className="text-lg text-gray-900">{clickedOrder.phone}</p>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="text-lg font-bold text-gray-900 border-b-2 border-red-700 pb-2">Order Info</h3>
									<div className="space-y-3">
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Address</p>
											<p className="text-base text-gray-900">{clickedOrder.address}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Order Date</p>
											<p className="text-lg text-gray-900">{new Date(clickedOrder.date).toLocaleString()}</p>
										</div>
										<div>
											<p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
											<p className="text-2xl font-bold text-red-700">Rs. {clickedOrder.total ? clickedOrder.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Order Status */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
								<h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-red-700 pb-2">Order Status</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<p className="text-xs text-gray-500 uppercase font-semibold mb-2">Current Status</p>
										<span className={`inline-block px-4 py-2 rounded-full font-semibold capitalize ${
											clickedOrder.status === "pending" ? "bg-yellow-100 text-yellow-800" :
											clickedOrder.status === "completed" ? "bg-green-100 text-green-800" :
											"bg-red-100 text-red-800"
										}`}>
											{clickedOrder.status}
										</span>
									</div>
									<div>
										<p className="text-xs text-gray-500 uppercase font-semibold mb-2">Change Status</p>
										<select
											className="w-full p-2 border-2 border-gray-300 rounded-lg font-semibold focus:border-red-700 focus:ring-2 focus:ring-red-200 transition-all"
											value={orderStatus}
											onChange={(e) => setOrderStatus(e.target.value)}
										>
											<option value="pending">Pending</option>
											<option value="completed">Completed</option>
											<option value="cancelled">Cancelled</option>
										</select>
									</div>
								</div>
							</div>

							{/* Order Notes */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
								<h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-red-700 pb-2">Order Notes</h3>
								<div className="mb-3">
									<p className="text-sm text-gray-600 mb-2">Current Notes:</p>
									<p className="text-gray-900 text-base">{clickedOrder.notes || '(No notes)'}</p>
								</div>
								<div>
									<p className="text-xs text-gray-500 uppercase font-semibold mb-2">Add/Edit Notes</p>
									<textarea
										className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg font-sans focus:border-red-700 focus:ring-2 focus:ring-red-200 transition-all"
										value={orderNotes}
										onChange={(e) => setOrderNotes(e.target.value)}
										placeholder="Enter order notes..."
									></textarea>
								</div>
							</div>

							{/* Items */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
								<h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-red-700 pb-2">Order Items ({clickedOrder.items?.length || 0})</h3>
								{clickedOrder.items && clickedOrder.items.length > 0 ? (
									<div className="space-y-3 max-h-[300px] overflow-y-auto">
										{clickedOrder.items.map((item, index) => (
											<div key={item._id || index} className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4 hover:shadow-md transition-shadow">
												<img
													src={item.image}
													alt={item.name}
													className="w-20 h-20 object-cover rounded-md border border-gray-300"
												/>
												<div className="flex-1">
													<p className="font-bold text-gray-900">{item.name}</p>
													<p className="text-sm text-gray-600">Quantity: {item.qty}</p>
													<p className="text-sm text-gray-600">Unit Price: Rs. {item.price ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</p>
													<p className="text-base font-semibold text-red-700">Subtotal: Rs. {(item.qty && item.price) ? (item.qty * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</p>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-gray-500">
										<p className="text-lg">No items in this order</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			{/* //{ currentPage , totalPages, setCurrentPage , limit , setLimit} */}
			<Paginator
				currentPage={page}
				totalPages={totalPages}
				setCurrentPage={setPage}
				limit={limit}
				setLimit={setLimit}
				setLoading={setLoading}
			/>
		</div>
	);
}
