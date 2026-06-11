"use client";

export function BotonImprimir() {
    return (
        <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.728 10.5h10.544a2.25 2.25 0 012.25 2.25v3a2.25 2.25 0 01-2.25 2.25H6.728a2.25 2.25 0 01-2.25-2.25v-3a2.25 2.25 0 012.25-2.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a2.25 2.25 0 00-2.25-2.25h-4.5a2.25 2.25 0 00-2.25 2.25v3.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18v1.5a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 01-2.25-2.25V18" />
            </svg>
            Imprimir comprobante
        </button>
    );
}
