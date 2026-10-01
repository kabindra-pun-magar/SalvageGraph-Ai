import {
    CheckCircle2,
    PackageCheck,
    Ruler,
    ShieldCheck,
} from "lucide-react";


interface MatchScoreBreakdownProps {

    compatibilityScore: number | null;

    conditionScore: number | null;

    quantityScore: number | null;

    dimensionScore: number | null;

    suitabilityScore: number | null;

}



export function MatchScoreBreakdown({

    compatibilityScore,

    conditionScore,

    quantityScore,

    dimensionScore,

    suitabilityScore,

}: MatchScoreBreakdownProps) {


    return (

        <div className="space-y-5">


            {/* Overall Score */}

            <div className="rounded-xl bg-slate-900 p-5 text-white">


                <div className="flex items-center gap-2">


                    <ShieldCheck size={20}/>


                    <p className="text-sm text-slate-300">

                        Overall Suitability Score

                    </p>


                </div>



                <p className="mt-3 text-4xl font-bold">

                    {
                        suitabilityScore !== null
                        ? `${suitabilityScore.toFixed(1)}%`
                        : "N/A"
                    }

                </p>



                <p className="mt-2 text-xs text-slate-400">

                    Calculated from compatibility, condition,
                    quantity and dimension factors.

                </p>


            </div>







            {/* Factor Scores */}

            <div className="grid gap-4 md:grid-cols-2">


                <ScoreItem

                    icon={<CheckCircle2 size={18}/>}

                    label="Compatibility"

                    description="Material type matching"

                    value={
                        compatibilityScore
                    }

                />



                <ScoreItem

                    icon={<ShieldCheck size={18}/>}

                    label="Condition"

                    description="Quality and usability"

                    value={
                        conditionScore
                    }

                />



                <ScoreItem

                    icon={<PackageCheck size={18}/>}

                    label="Quantity"

                    description="Required amount matching"

                    value={
                        quantityScore
                    }

                />



                <ScoreItem

                    icon={<Ruler size={18}/>}

                    label="Dimension"

                    description="Size compatibility"

                    value={
                        dimensionScore
                    }

                />


            </div>


        </div>

    );

}








function ScoreItem({

    icon,

    label,

    description,

    value,

}:{

    icon:React.ReactNode;

    label:string;

    description:string;

    value:number|null;

}){


    const percentage =
        value !== null
        ? Math.min(Math.max(value,0),100)
        : 0;



    return (

        <div className="rounded-xl border border-slate-200 bg-white p-4">


            <div className="flex items-center gap-3">


                <div className="text-slate-500">

                    {icon}

                </div>



                <div>

                    <p className="text-sm font-medium text-slate-800">

                        {label}

                    </p>


                    <p className="text-xs text-slate-400">

                        {description}

                    </p>

                </div>


            </div>





            <div className="mt-4 flex items-center gap-3">


                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">


                    <div

                        className="h-full rounded-full bg-slate-900"

                        style={{
                            width:`${percentage}%`
                        }}

                    />


                </div>




                <span className="text-sm font-semibold text-slate-800">


                    {
                        value !== null
                        ? `${value.toFixed(1)}%`
                        : "N/A"
                    }


                </span>


            </div>



        </div>

    );

}