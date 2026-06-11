import { ProductoCliente, LoteProductoCliente } from "@/modules/productos/types";

export interface LoteAlerta extends LoteProductoCliente {
    producto: ProductoCliente;
    diasParaVencer: number;
}

export interface AlertasSanitarias {
    vencidos: LoteAlerta[];
    proximos30Dias: LoteAlerta[];
    proximos60Dias: LoteAlerta[];
    stockBajoGlobal: ProductoCliente[];
    lotesVacios: LoteAlerta[];
}
