import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next';
import { RSCPathnameNormalizer } from 'next/dist/server/normalizers/request/rsc';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

const supabase = createClient(supabaseUrl, supabaseKey);

type Data = {
    Title: string;
    Steps: number;
}[]

type ErrorResponse = {
    error: string
}

import postgres from 'postgres';

export default async function dataHandler(req: NextApiRequest, res: NextApiResponse<Data | ErrorResponse>) {

    const { data, error } = await supabase 
        .from("ddr_world_songs")
        .select('Title, Steps')
        
    if (error) {
        return res.status(500).json({error: error.message})
    }

    return res.status(200).json(data as Data)

}
