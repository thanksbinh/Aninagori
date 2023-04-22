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
}

const MediaSlider = ({ images, setIndex, index }: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(index);

    useEffect(() => {
        setCurrentImageIndex(index - 1);
    }, [index]);

    const handlePrevious = (e: any) => {
        e.stopPropagation();
        if (currentImageIndex === 0) {
            setCurrentImageIndex(images.length - 1);
            setIndex(images.length);
        } else {
            setCurrentImageIndex(currentImageIndex - 1);
            setIndex(currentImageIndex);
        }
    };

    const handleNext = (e: any) => {
        e.stopPropagation();
        if (currentImageIndex === images.length - 1) {
            setCurrentImageIndex(0);
            setIndex(1);
        } else {
            setCurrentImageIndex(currentImageIndex + 1);
            setIndex(currentImageIndex + 2);
        }
    };

    return (
        <div className="relative w-full h-full">
            <img
                draggable="false"
                src={images[currentImageIndex]}
                alt={""}
                className={`cursor-pointer object-cover object-center rounded-2xl`}
            />

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
