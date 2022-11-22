// Import library
import { useState } from "react";

function useOrder(childrens) {
    const [stepIndex, setStepIndex] = useState(0);

    function goTo(index) {
        setStepIndex(index);
    }

    function next() {
        setStepIndex((i) => {
            if (i >= childrens.length - 1) return i;
            return i + 1;
        });
    }

    function back() {
        setStepIndex((i) => {
            if (i <= 0) return i;
            return i - 1;
        });
    }

    return {
        currentStepIndex: stepIndex,
        steps: childrens,
        step: childrens[stepIndex],
        isFirstPage: stepIndex === 0,
        isLastPage: stepIndex === childrens.length - 1,
        goTo,
        next,
        back,
    };
}

export default useOrder;
