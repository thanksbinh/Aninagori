"use client"

import { Dispatch, SetStateAction } from "react";

import Modal from "@/components/utils/Modal";
import MediaSlider from "./MediaSlider";

// Todo: Optimization
export default function MediaFullView({ isOpen, onClose, index, setIndex, imageUrl, slideRef }: { isOpen: boolean; onClose: any; index: number; setIndex: Dispatch<SetStateAction<number>>; imageUrl: any; slideRef: any; }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={""}>
            <div className="w-[1100px]">
                <div className="relative flex justify-center items-center bg-black rounded-2xl">
                    {typeof imageUrl === "object" ? (
                        (imageUrl as any).length > 1 ? (
                            <>
                                <MediaSlider images={(imageUrl as any).map((data: string) => data)} setIndex={setIndex} index={index} fullView={true} slideRef={slideRef} />
                                <div
                                    className="absolute m-auto leading-6 text-center opacity-40 rounded-tr-2xl top-0 right-0 w-12 h-6 bg-slate-700 text-white"
                                >
                                    {index}/{(imageUrl as any).length}
                                </div>
                            </>
                        ) : (
                            <div className="flex">
                                <img
                                    draggable="false"
                                    src={imageUrl[0]}
                                    alt={""}
                                    className={`max-w-full object-contain object-center rounded-2xl min-h-[615px]`}
                                />
                            </div>
                        )
                    ) : (
                        <div className="flex">
                            <img
                                draggable="false"
                                src={imageUrl}
                                alt={""}
                                className={`max-w-full object-contain object-center rounded-2xl min-h-[615px]`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}