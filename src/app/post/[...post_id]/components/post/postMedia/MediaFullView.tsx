"use client"

import { Dispatch, SetStateAction } from "react";

import Modal from "@/components/utils/Modal";
import MediaSlider from "./MediaSlider";

// Todo: Optimization
export default function MediaFullView({ isOpen, onClose, index, setIndex, imageUrl }: { isOpen: boolean; onClose: any; index: number; setIndex: Dispatch<SetStateAction<number>>; imageUrl: any; }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={""}>
            <div className="w-[1100px]">
                <div className="flex flex-col flex-1 rounded-md relative">
                    <div className="relative flex flex-col -mx-4">
                        <div className="relative px-4">
                            {(imageUrl as any).length > 1 ? (
                                <>
                                    <MediaSlider images={(imageUrl as any).map((data: string) => data)} setIndex={setIndex} index={index} />
                                    <div
                                        className="absolute m-auto leading-6 text-center opacity-40 rounded-tr-2xl top-0 right-4 w-12 h-6 bg-slate-700 text-white"
                                    >
                                        {index}/{(imageUrl as any).length}
                                    </div>
                                </>
                            ) : (
                                <img
                                    draggable="false"
                                    src={imageUrl[0]}
                                    alt={""}
                                    className={`cursor-pointer object-cover object-center rounded-2xl`}
                                />
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}