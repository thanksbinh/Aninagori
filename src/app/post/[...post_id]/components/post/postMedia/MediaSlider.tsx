import { useState } from "react";
import { TiArrowLeft } from "@react-icons/all-files/ti/TiArrowLeft";
import { TiArrowRight } from "@react-icons/all-files/ti/TiArrowRight";
import classNames from "classnames/bind"
import styles from "../PostContent.module.scss"
const cx = classNames.bind(styles)

interface ImageSliderProps {
    images: string[];
}

const MediaSlider = ({ images }: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevious = () => {
        if (currentImageIndex === 0) {
            setCurrentImageIndex(images.length - 1);
        } else {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentImageIndex === images.length - 1) {
            setCurrentImageIndex(0);
        } else {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    return (
        <div className="relative w-full h-full">
            <img
                draggable="false"
                src={images[currentImageIndex]}
                alt={""}
                onClick={() => {
                    //TODO: handle view image in full screen
                }}
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
