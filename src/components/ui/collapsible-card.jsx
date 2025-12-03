import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
    CollapsibleCard: reusable card component with toggle functionality
    
    Encapsulates collapse/expand state and provides a clean interface
    for sections that should be hidden by default.
    
    Props:
    - title: string - The title displayed in CardHeader
    - children: ReactNode - Content to be shown/hidden
    - className: string - Optional additional classes for the Card
*/
export function CollapsibleCard({ title, children, className }) {
    const [isExpanded, setIsExpanded] = useState(false);

    function toggleClickHandlerACB() {
        setIsExpanded(prev => !prev);
    }

    return (
        <Card className={cn("border-light/40 bg-dark/40", className)}>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            
            <div className="flex justify-center pb-4">
                <Button
                    onClick={toggleClickHandlerACB}
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                >
                    {isExpanded ? "Show less" : "Show more"}
                </Button>
            </div>

            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <CardContent>
                    {children}
                </CardContent>
            </div>
        </Card>
    );
}

