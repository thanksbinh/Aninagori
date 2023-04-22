import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TiArrowLeft } from "@react-icons/all-files/ti/TiArrowLeft";
import { TiArrowRight } from "@react-icons/all-files/ti/TiArrowRight";
import classNames from "classnames/bind"
import styles from "../PostContent.module.scss"
const cx = classNames.bind(styles)

interface ImageSliderProps {
    images: string[];
    setIndex: Dispatch<SetStateAction<number>>
    index: number
    fullView: boolean
    slideRef: any
}

const MediaSlider = ({ images, setIndex, index, fullView, slideRef }: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(index);

    useEffect(() => {
        setCurrentImageIndex(index - 1);
    }, [index]);

    const handlePrevious = (e: any) => {
        e.stopPropagation();
        if (currentImageIndex === 0) {
            setIndex(images.length);
            slideRef.current.goBack();
        } else {
            setIndex(currentImageIndex);
            slideRef.current.goBack();
        }
    };

    const handleNext = (e: any) => {
        e.stopPropagation();
        if (currentImageIndex === images.length - 1) {
            setIndex(1);
            slideRef.current.goNext();
        } else {
            setIndex(currentImageIndex + 2);
            slideRef.current.goNext();
        }
    };

    return (
        <div className="relative w-full h-full flex justify-center items-center bg-black rounded-2xl">
            <div className="flex">
                <img
                    draggable="false"
                    src={images[currentImageIndex]}
                    alt={""}
                    className={`max-w-full object-contain object-center rounded-2xl ${fullView ? "min-h-[615px]" : "h-[275px] cursor-pointer"}`}
                />
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                    onClick={handlePrevious}
                    className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                    <TiArrowLeft className="h-5 w-5" />
                </button>

                <button
                    onClick={handleNext}
                    className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                    <TiArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default MediaSlider;
