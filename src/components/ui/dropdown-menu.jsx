import { useState } from "react"
import { cn } from "@/lib/utils"

/*
    DropdownMenu: simple modal component with backdrop
    
    Encapsulates open/close state and provides a clean interface
    for centered modals triggered by clicking an element.
    
    Props:
    - trigger: ReactNode - The clickable element that toggles the modal
    - children: ReactNode - Content to be shown in the modal
    - className: string - Optional additional classes for the trigger container
*/
export function DropdownMenu({ trigger, children, className }) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleClickHandlerACB() {
        setIsOpen(prev => !prev);
    }

    function closeModalACB() {
        setIsOpen(false);
    }

    function stopPropagationACB(e) {
        e.stopPropagation();
    }

    return (
        <>
            <div className={cn("inline-block", className)}>
                <div onClick={toggleClickHandlerACB}>
                    {trigger}
                </div>
            </div>
            {isOpen && (
                <div
                    onClick={closeModalACB}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm transition-opacity duration-200"
                >
                    <div
                        onClick={stopPropagationACB}
                        className="rounded border border-light/40 bg-dark/95 shadow-lg transition-all duration-200"
                    >
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

