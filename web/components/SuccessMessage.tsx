interface SuccessMessageProps {


    message: string;
    type: number;
}

const SuccessMessage = ({ message, type }: SuccessMessageProps) => {




    // let color = "text-gray-300"
    // let bgColor = "rounded-md p-3 flex [animation:1s_fade-out_1.3s_forwards]";
    // let icon = <svg
    //     className="stroke-2 stroke-current text-green-600 h-8 w-8 mr-2 flex-shrink-0"
    //     viewBox="0 0 24 24"
    //     fill="none"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    // >
    //     <path d="M0 0h24v24H0z" stroke="none" />
    //     <circle cx="12" cy="12" r="9" />
    //     <path d="M9 12l2 2 4-4" />
    // </svg>;


    // let errorIcon =
    //     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-2 stroke-current h-8 w-8 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    //         <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    //     </svg>;

    // if (type === 1) {
    //     color = "text-green-700";
    //     bgColor += " bg-green-100";

    // } else {
    //     color = "text-red-700";
    //     bgColor += " bg-red-100";
    //     icon = errorIcon;
    // }

    return (
        <>

            {/* <div className='fixed bottom-10 w-fit' >
                <div className={bgColor}>
                    {icon}

                    <div className={color}>
                        <div className="font-bold text-xl">{message}</div>
                    </div>
                </div>
            </div> */}

        </>
    )

}


export default SuccessMessage