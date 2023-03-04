import {AnimatePresence, motion} from "framer-motion";
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import DropDown, {VibeType} from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
// @ts-ignore
import { Portal } from 'react-portal';
import dynamic from 'next/dynamic';


const Home: NextPage = () => {
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [mode, setMode] = useState<VibeType>("Junior");
    const [generatedCode, setGeneratedCode] = useState<any>("");

    useEffect(() => {
        console.log(generatedCode)
    }, [generatedCode]);

    const getGeneratedCounter = (): string => {
        const baseTime = new Date("March 3, 2023 13:00:00 GMT+7").getTime();  // Set the base time to 2pm Thailand time on March 2, 2023
        const elapsedMilliseconds = new Date().getTime() - baseTime;
        const elapsedMinutes = elapsedMilliseconds / (1000 * 60);
        const codeSnippets = 118 + Math.floor(elapsedMinutes / 10) * 6;  // Calculate the number of code snippets converted based on the elapsed time

        return `${codeSnippets} AI components generated so far.`;

    }

    const generateBio = async (e: any) => {
        e.preventDefault();
        setGeneratedCode("");
        setLoading(true);
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                mode
            }),
        });
        console.log("Edge function returned.");

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        const {value, done: doneReading} = await reader.read();

        console.log(decoder.decode(value))

        setGeneratedCode(decoder.decode(value));
        setLoading(false);
    };


    return (
        <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title>AI to UI component generator</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Header/>

            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-10">
                <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900">
                    Ask for any <span style={{color: '#7AAC9F'}}>component</span>

                </h1>
                <h2 className="sm:text-4xl text-4xl max-w-2xl font-bold text-slate-900  sm:mt-4">
                    AI will generate it for you
                </h2>
                <p className="text-slate-500 mt-5">{getGeneratedCounter()}</p>
                <div className="max-w-xl w-full">
                    <div className="flex mt-10 items-center space-x-3">
                        <p className="text-left font-medium">
                            Describe which component you need{" "}
                        </p>
                    </div>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                        placeholder={
                            "e.g. an about us section with 3 columns of team members, centered text, rounded profile images"
                        }
                    />

                    {!loading && (
                        <button
                            disabled={!prompt}
                            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                            onClick={(e) => generateBio(e)}
                        >
                            Make my day &rarr;
                        </button>
                    )}
                    {loading && (
                        <button
                            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                            disabled
                        >
                            <LoadingDots color="white" style="large"/>
                        </button>
                    )}
                </div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{duration: 2000}}
                />
                <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700"/>
                <ResizablePanel>
                    <AnimatePresence mode="wait">
                        <motion.div className="space-y-10 my-10">
                            {generatedCode && (
                                <>
                                    <div>
                                        <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                                            Your TypeScript code
                                        </h2>
                                    </div>
                                    <div
                                        className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                                        <div
                                            className=" whitespace-normal bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border max-w-full"
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedCode);
                                                toast("Code copied to clipboard", {
                                                    icon: "✂️",
                                                });
                                            }}
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: generatedCode }} />

                                        </div>
                                    </div>

                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </ResizablePanel>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;