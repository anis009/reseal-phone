import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
const MyProducts = () => {
	const {
		data: products = [],
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["myproducts"],
		queryFn: async () => {
			try {
				const { data } = await axios.get("http://localhost:5000/myproducts", {
					headers: {
						authorization: `bearer ${localStorage.getItem("accessToken")}`,
					},
				});
				console.log(data);
				return data;
			} catch (error) {
				toast.error(error.message);
				console.log(error);
			}
		},
	});

	if (isLoading) {
		return <Loader></Loader>;
	}
	const deleteHandler = async (id) => {
		const { data } = await axios.delete(
			`http://localhost:5000/myproducts/${id}`,
			{
				headers: {
					authorization: `bearer ${localStorage.getItem("accessToken")}`,
				},
			}
		);
		console.log(data);
		if (data.deletedCount > 0) {
			refetch();
			toast.success("product delete successfully");
		}
	};
	return (
		<div>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr>
							<th></th>
							<th>Image</th>
							<th>Name</th>
							<th>Price</th>
							<th>IsAvailable</th>
							<th>Advertise</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{products &&
							products.map((product, index) => {
								return (
									<tr>
										<th>{index + 1}</th>

										<td>
											<div className="avatar">
												<div className="w-24 rounded-full">
													<img src={product.image} alt="" />
												</div>
											</div>
										</td>

										<td>{product.name}</td>
										<td>$ {product.price}</td>
										<td>
											{product.isAvailable ? (
												<div className="badge badge-primary">Available</div>
											) : (
												<div className="badge badge-secondary">Sold</div>
											)}
										</td>

										<td>
											{product.isAvailable && (
												<button className="btn btn-primary btn-sm">
													advertise
												</button>
											)}
										</td>
										<td>
											<button
												className="btn btn-error btn-sm"
												onClick={() => deleteHandler(product._id)}
											>
												delete
											</button>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default MyProducts;
