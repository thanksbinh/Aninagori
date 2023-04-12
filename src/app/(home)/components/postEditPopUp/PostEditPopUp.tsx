import classNames from "classnames/bind"
import styles from "../postForm/PostForm.module.scss"
import { useState, useImperativeHandle, forwardRef } from "react";

const cx = classNames.bind(styles);

function PostEditPopUp(props: any, ref: any) {
    const [postData, setPostData] = useState<any>({});
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        setPostData: (data: any) => {
            setPostData(data);
        },
        setOpen: (open: boolean) => {
            setOpen(open);
        },
    }))

    return (
        !open ? <></> : (
            <div className={cx("modal")} onClick={() => { setOpen(false) }} ref={ref}>
                <div className={cx("modal_overlay")}></div>
                <div onClick={(e) => e.stopPropagation()}>{postData?.id}</div>
            </div>
        )
    )
}


export default forwardRef(PostEditPopUp);