"use client"
import React from 'react'
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignInPage from '../signin';
import colors from "colors";

function testpage() {
  const { status, data, update  } = useSession();
  const router = useRouter();

  console.log('status :>> ', status);
  console.log('data :>> ', data);
  console.log('update :>> ', update);
  const showSession = () => {
    if (status === "authenticated") {
      return (
        <button
          className="border border-solid border-black rounded"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });
          }}
        >
          Sign Out
        </button>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <Link
          href="/testpage"
          className="border border-solid border-black rounded"
        >
          Sign In
        </Link>
      );
    }
  };
  
  return (
    <>
    <div>testpage</div>
    <SignInPage/>
    {showSession()}
    </>
  )
}

export default testpage