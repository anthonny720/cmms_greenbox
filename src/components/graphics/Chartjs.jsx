import React from 'react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import {Bar} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);
const StackedBar = ({labels, data, title}) => {


    return (
        <>
            <h1 className=' text-center font-light text-gray-500'>{title}</h1>
            <Bar title={title} data={{labels: labels, datasets: data}}/>
        </>

    )
}
export default StackedBar