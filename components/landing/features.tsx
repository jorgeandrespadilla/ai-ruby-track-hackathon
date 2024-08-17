"use client";

import React, {
    forwardRef,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion, useInView } from "framer-motion";

import { cn } from "@/lib/utils";

type AccordionItemProps = {
    children: React.ReactNode;
    className?: string;
} & Accordion.AccordionItemProps;

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ children, className, ...props }, forwardedRef) => (
        <Accordion.Item
            className={cn(
                "mt-px overflow-hidden focus-within:relative focus-within:z-10",
                className,
            )}
            {...props}
            ref={forwardedRef}
        >
            {children}
        </Accordion.Item>
    ),
);

type AccordionTriggerProps = {
    children: React.ReactNode;
    className?: string;
};

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ children, className, ...props }, forwardedRef) => (
        <Accordion.Header className="flex">
            <Accordion.Trigger
                className={cn(
                    "group flex h-[45px] flex-1 cursor-pointer items-center justify-between px-5 text-[15px] leading-none outline-none",
                    className,
                )}
                {...props}
                ref={forwardedRef}
            >
                {children}
            </Accordion.Trigger>
        </Accordion.Header>
    ),
);

type AccordionContentProps = {
    children: ReactNode;
    className?: string;
} & Accordion.AccordionContentProps;

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
    ({ children, className, ...props }, forwardedRef) => (
        <Accordion.Content
            className={cn(
                "overflow-hidden text-[15px] font-medium data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down",
                className,
            )}
            {...props}
            ref={forwardedRef}
        >
            <div className="px-5 py-2">{children}</div>
        </Accordion.Content>
    ),
);

type CardDataProps = {
    id: number;
    title: string;
    content: string;
    image?: string;
    video?: string;
};

const cardData: CardDataProps[] = [
    {
        id: 1,
        title: "AI Complaint Analysis",
        content:
            "Automatically detect and summarize customer complaints with advanced AI, ensuring quick and accurate responses.",
        image:
            "https://images.unsplash.com/photo-1562071433-0686c833f4b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
    },
    {
        id: 2,
        title: "Auto Categorization",
        content:
            "Assign complaints to the correct categories automatically, reducing manual work and errors.",
        image:
            "https://images.unsplash.com/photo-1571042283422-203e15c57114?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 3,
        title: "RAG Pipeline",
        content:
            "Match voice recordings with relevant past complaints using a Retrieval-Augmented Generation pipeline.",
        image:
            "https://images.unsplash.com/photo-1581092918689-85d44457a9a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        title: "Multi-Modal Input",
        content:
            "Handle complaints from text, voice, video, and images for comprehensive analysis and categorization.",
        image:
            "https://images.unsplash.com/photo-1603415526960-f2e7c80a7acb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
    },
];


type FeatureProps = {
    collapseDelay?: number;
    ltr?: boolean;
    linePosition?: "left" | "right";
};

const Feature = ({
    collapseDelay = 5000,
    ltr = false,
    linePosition = "left",
}: FeatureProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    const carouselRef = useRef<HTMLUListElement>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        amount: 0.5,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isInView) {
                setCurrentIndex(0);
            } else {
                setCurrentIndex(-1);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isInView]);

    const scrollToIndex = (index: number) => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelectorAll(".card")[index];
            if (card) {
                const cardRect = card.getBoundingClientRect();
                const carouselRect = carouselRef.current.getBoundingClientRect();
                const offset =
                    cardRect.left -
                    carouselRect.left -
                    (carouselRect.width - cardRect.width) / 2;

                carouselRef.current.scrollTo({
                    left: carouselRef.current.scrollLeft + offset,
                    behavior: "smooth",
                });
            }
        }
    };

    // interval for changing images
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex !== undefined ? (prevIndex + 1) % cardData.length : 0,
            );
        }, collapseDelay);

        return () => clearInterval(timer);
    }, [currentIndex]);

    useEffect(() => {
        const handleAutoScroll = () => {
            const nextIndex =
                (currentIndex !== undefined ? currentIndex + 1 : 0) % cardData.length;
            scrollToIndex(nextIndex);
        };

        const autoScrollTimer = setInterval(handleAutoScroll, collapseDelay);

        return () => clearInterval(autoScrollTimer);
    }, [currentIndex]);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            const handleScroll = () => {
                const scrollLeft = carousel.scrollLeft;
                const cardWidth = carousel.querySelector(".card")?.clientWidth || 0;
                const newIndex = Math.min(
                    Math.floor(scrollLeft / cardWidth),
                    cardData.length - 1,
                );
                setCurrentIndex(newIndex);
            };

            carousel.addEventListener("scroll", handleScroll);
            return () => carousel.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <section ref={ref} id="features">
            <div className="py-14">
                <div className="container flex w-full flex-col items-center justify-center p-4">
                    <div className="mx-auto max-w-5xl text-center">
                        <h4 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                            <span
                                className="text-[var(--color-one)] font-black tracking-[1.5px] "
                                style={{
                                    textShadow: "2px 2px 3px rgba(0, 0, 0, 0.5), -2px -2px 3px rgba(255, 255, 255, 0.2)",
                                }}
                            >Features</span>
                        </h4>
                        <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
                            Speed up complaint resolution with AI precision
                        </h2>
                    </div>
                    <div className="mx-auto my-12 grid h-full max-w-5xl grid-cols-5 gap-x-10">
                        <div
                            className={`col-span-2 hidden md:flex ${ltr ? "md:order-2 md:justify-end" : "justify-start"
                                }`}
                        >
                            <Accordion.Root
                                className="w-[300px]"
                                type="single"
                                defaultValue={`item-${currentIndex}`}
                                value={`item-${currentIndex}`}
                                onValueChange={(value) =>
                                    setCurrentIndex(Number(value.split("-")[1]))
                                }
                            >
                                {cardData.map((item, index) => (
                                    <AccordionItem
                                        key={item.id}
                                        className="relative mb-8 last:mb-0"
                                        value={`item-${index}`}
                                    >
                                        <div
                                            className={`absolute bottom-0 top-0 h-full w-0.5 overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30 ${linePosition === "right"
                                                ? "left-auto right-0"
                                                : "left-0 right-auto"
                                                }`}
                                        >
                                            <div
                                                className={`absolute left-0 top-0 w-full ${currentIndex === index ? "h-full" : "h-0"
                                                    } origin-top bg-neutral-500 transition-all ease-linear dark:bg-white`}
                                                style={{
                                                    transitionDuration:
                                                        currentIndex === index
                                                            ? `${collapseDelay}ms`
                                                            : "0s",
                                                }}
                                            ></div>
                                        </div>
                                        <AccordionTrigger className="text-xl font-bold">
                                            {item.title}
                                        </AccordionTrigger>
                                        <AccordionContent>{item.content}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion.Root>
                        </div>
                        <div
                            className={`col-span-5 h-[350px] min-h-[200px] w-auto md:col-span-3 ${ltr && "md:order-1"
                                }`}
                        >
                            {cardData[currentIndex]?.image ? (
                                <motion.img
                                    key={currentIndex}
                                    src={cardData[currentIndex].image}
                                    alt="feature"
                                    className="aspect-auto h-full w-full rounded-xl border border-neutral-300/50 object-cover p-1"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                />
                            ) : cardData[currentIndex]?.video ? (
                                <video
                                    preload="auto"
                                    src={cardData[currentIndex].video}
                                    className="aspect-auto h-full w-full rounded-lg object-cover"
                                    autoPlay
                                    loop
                                    muted
                                />
                            ) : (
                                <div className="aspect-auto h-full w-full rounded-xl border border-neutral-300/50 bg-gray-200 p-1"></div>
                            )}
                        </div>

                        <ul
                            ref={carouselRef}
                            className="col-span-5 flex h-full snap-x flex-nowrap overflow-x-auto py-10 [-ms-overflow-style:none] [-webkit-mask-image:linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] [mask-image:linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden snap-mandatory"
                            style={{
                                padding: "50px calc(50%)",
                            }}
                        >
                            {cardData.map((item, index) => (
                                <a
                                    key={item.id}
                                    className="card relative mr-8 grid h-full max-w-60 shrink-0 items-start justify-center py-4 last:mr-0"
                                    onClick={() => setCurrentIndex(index)}
                                    style={{
                                        scrollSnapAlign: "center",
                                    }}
                                >
                                    <div className="absolute bottom-0 left-0 right-auto top-0 h-0.5 w-full overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30">
                                        <div
                                            className={`absolute left-0 top-0 h-full ${currentIndex === index ? "w-full" : "w-0"
                                                } origin-top bg-neutral-500 transition-all ease-linear dark:bg-white`}
                                            style={{
                                                transitionDuration:
                                                    currentIndex === index ? `${collapseDelay}ms` : "0s",
                                            }}
                                        ></div>
                                    </div>
                                    <h2 className="text-xl font-bold">{item.title}</h2>
                                    <p className="mx-0 max-w-sm text-balance text-sm">
                                        {item.content}
                                    </p>
                                </a>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export function FeatureSection() {
    return <Feature collapseDelay={5000} linePosition="left" />;
}
