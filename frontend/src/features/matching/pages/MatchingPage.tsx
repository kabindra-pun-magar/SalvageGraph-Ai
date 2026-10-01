import { Card } from "../../../components/ui/Card";


export function MatchingPage() {


    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold text-slate-900">

                    Material Matching

                </h1>


                <p className="mt-1 text-sm text-slate-500">

                    View and manage AI-generated material matches.

                </p>


            </div>





            <Card>


                <div className="p-6">


                    <p className="text-sm text-slate-600">

                        Matching results will appear here.

                    </p>


                </div>


            </Card>



        </div>

    );

}