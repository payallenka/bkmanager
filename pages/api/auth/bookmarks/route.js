import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
    const res = await axios.get("https://bookmarkmanager-dq8p.onrender.com/api/bookmarks/", {
        headers: {
            Authorization: `Bearer ${req.cookies.get("next-auth.session-token")}`,
        },
    });
    return NextResponse.json(res.data);
}

export async function POST(req) {
    const { title, url, category } = await req.json();
    const res = await axios.post(
        "http://127.0.0.1:8000/api/bookmarks/",
        { title, url, category },
        {
            headers: {
                Authorization: `Bearer ${req.cookies.get("next-auth.session-token")}`,
            },
        }
    );
    return NextResponse.json(res.data);
}
