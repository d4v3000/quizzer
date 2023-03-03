import React from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

function SignUp({ providers }: any) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black bg-gradient-to-b from-zinc-800 to-zinc-900 pb-40 font-semibold text-zinc-300">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 pb-4">
          <Image
            src="/quizzerLogo.svg"
            alt="Quizzer Logo"
            className="p-2"
            height={100}
            width={100}
          />
          <p className="text-xl">Create your Quizzer Account</p>
        </div>
        <div
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-indigo-400 bg-indigo-500 py-2 px-20 text-white hover:bg-indigo-400"
          onClick={() => signIn(providers.google.id, { callbackUrl: "/" })}
        >
          <GoogleOutlined className="text-white" />
          Continue with Google
        </div>
      </div>
    </div>
  );
}

export default SignUp;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
