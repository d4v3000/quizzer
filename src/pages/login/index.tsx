import React from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { getProviders, signIn } from "next-auth/react";

function Login({ providers }: any) {
	console.log(providers);

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 pb-40 font-semibold">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-center gap-3 pb-4">
					<div>Logo</div>
					<p className="text-xl">Log in to App</p>
				</div>
				<div
					className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-indigo-400 bg-indigo-500 py-2 px-20 text-white hover:bg-indigo-400"
					onClick={() => signIn(providers.google.id, { callbackUrl: "/" })}
				>
					<GoogleOutlined className="text-white" />
					Continue with Google
				</div>
				<div
					className="flex cursor-pointer items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 py-2 hover:bg-zinc-700"
					onClick={() => signIn(providers.email.id)}
				>
					Continue with Email
				</div>
			</div>
		</div>
	);
}

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();
	return {
		props: { providers },
	};
}