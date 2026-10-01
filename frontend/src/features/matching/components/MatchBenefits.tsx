import {
    MapPin,
    Truck,
    DollarSign,
    Leaf,
} from "lucide-react";


import { Card } from "../../../components/ui/Card";



interface MatchBenefitsProps {

    distanceKm: number | null;

    transportCost: number | string | null;

    economicBenefit: number | string | null;

    environmentalBenefit?: unknown;

}



export function MatchBenefits({

    distanceKm,

    transportCost,

    economicBenefit,

    environmentalBenefit,

}: MatchBenefitsProps) {



    return (

        <div className="grid gap-4 md:grid-cols-4">



            <BenefitCard

                icon={
                    <MapPin size={18}/>
                }

                title="Distance"

                value={

                    distanceKm !== null

                    ? `${distanceKm.toFixed(2)} km`

                    : "Unavailable"

                }

            />






            <BenefitCard

                icon={
                    <Truck size={18}/>
                }

                title="Transport Cost"

                value={

                    transportCost !== null

                    ? formatValue(
                        transportCost
                    )

                    : "Unavailable"

                }

            />







            <BenefitCard

                icon={
                    <DollarSign size={18}/>
                }

                title="Economic Benefit"

                value={

                    economicBenefit !== null

                    ? formatValue(
                        economicBenefit
                    )

                    : "Unavailable"

                }

            />








            <BenefitCard

                icon={
                    <Leaf size={18}/>
                }

                title="Environmental"

                value={

                    environmentalBenefit

                    ? "Reuse Impact Available"

                    : "Not Calculated"

                }

            />



        </div>

    );

}








function BenefitCard({

    icon,

    title,

    value,

}:{

    icon:React.ReactNode;

    title:string;

    value:string;

}){


    return (

        <Card>


            <div className="space-y-3">


                <div className="flex items-center gap-2 text-slate-500">


                    {icon}


                    <p className="text-sm">

                        {title}

                    </p>


                </div>





                <p className="text-lg font-semibold text-slate-900">

                    {value}

                </p>



            </div>


        </Card>

    );

}







function formatValue(
    value:number|string
){

    const numberValue =
        Number(value);



    if(
        Number.isNaN(numberValue)
    ){

        return String(value);

    }



    return numberValue.toFixed(2);

}