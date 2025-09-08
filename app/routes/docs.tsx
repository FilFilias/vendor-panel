import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useRef, useState } from "react";

export const meta: MetaFunction = () => ([
  { title: "Ventor Partners API – v1 Docs" },
  { name: "description", content: "Vendor-facing API documentation for product sync and order intake between Vendor ERPs and Ventor." },
]);

// --- Small UI bits (no external deps) ---
function Anchor({ id, children }: { id: string; children: React.ReactNode }) {
  useEffect(() => {
    if (location.hash === `#${id}`) {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [id]);
  return (
    <a id={id} className="block -mt-24 pt-24" />
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="relative group">
      <button onClick={onCopy} className="absolute right-2 top-2 text-xs rounded px-2 py-1 border border-gray-300 hover:bg-gray-50">
        {copied ? "Copied" : "Copy"}
      </button>
      <pre ref={preRef} className="overflow-x-auto text-sm p-4 bg-gray-900 text-gray-100 rounded-lg">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}

function KVP({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div className="text-gray-500">{k}</div>
      <div className="col-span-2 font-mono">{v}</div>
    </div>
  );
}

export default function DocsPartners() {
  const baseUrl = "https://medusa-ventor-production.up.railway.app";
  const apiKeyVar = "x-publishable-api-key";

  const curl = {
    upsert: `curl -X POST "${baseUrl}/store/partners/products" \\\n  -H "${apiKeyVar}: $API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "id": "12345",\n  "title": "Basic Hoodie",\n  "image": "https://example.com/hoodie.jpg",\n  "description": "Unisex hoodie",\n  "price": 35.5,\n  "quantity": 100,\n  "barcode": "HD-001",\n  "sku": "HD-0001-12345",\n  "category": "apparel",\n  "vat_status": "24",\n  "variations": []\n}'`,
    delete: `curl -X DELETE "${baseUrl}/store/partners/products/delete/12345" \\\n  -H "${apiKeyVar}: $API_KEY"`,
    pending: `curl -X GET "${baseUrl}/store/partners/orders/pending" \\\n  -H "${apiKeyVar}: $API_KEY"`,
    complete: `curl -X PUT "${baseUrl}/store/partners/orders/complete/ord_abc123" \\\n  -H "${apiKeyVar}: $API_KEY"`,
    getOne: `curl -X GET "${baseUrl}/store/partners/orders/ord_abc123" \\\n  -H "${apiKeyVar}: $API_KEY"`,
  };

  const productPayloadTs = `{
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  color: string | null;
  price: number | null;      // υποχρεωτικό αν ΔΕΝ υπάρχουν variations
  quantity: number | null;   // υποχρεωτικό αν ΔΕΝ υπάρχουν variations
  barcode: string | null;    // υποχρεωτικό αν ΔΕΝ υπάρχουν variations
  sku: string | null;        // υποχρεωτικό αν ΔΕΝ υπάρχουν variations
  category: string;
  vat_status: string | number | null;
  variations: {
    price: number;
    quantity: number;
    barcode: string;
    sku: string;
    size: string;
  }[] | null;
}`;

  const ordersPendingSchema = `{
  id: string;
  status: "pending" | "completed";
  created_at: string; 
  currency_code: string;
  subtotal: number;
  tax_total: number;
  total: number;
  items: {
    id:string;
    title:string;
    barcode:string;
    quantity:number;
    total:number;
    tax_total:number;
  }[]
  customer: {
    company: string;
    vat_no:string;
    email:string;
    phone:string;
  }
  shipping_address: {
    company:string;
    address:string;
    city:string;
    country_code:string;
    phone:string;
    postal_code:string;
  }
}[]`;

  const orderSchema = `{
  id:string;
  status: "pending" | "completed";
  currency_code: string;
  total: number;
  subtotal: number;
  created_at: string;
  items: {
    id:string;
    title:string;
    barcode:string;
    quantity:number;
    total:number;
    tax_total:number;
  }[]
  customer: {
    company: string;
    vat_no:string;
  }
  shipping_address: {
    address:string;
    city:string;
    country_code:string;
    phone:string;
    postal_code:string;
  }
}`;

  const toc = useMemo(
    () => [
      { id: "intro", label: "Intro" },
      { id: "auth", label: "Authentication" },
      { id: "products-upsert", label: "Products – Upsert" },
      { id: "products-delete", label: "Products – Delete" },
      { id: "orders-pending", label: "Orders – Get Pending" },
      { id: "orders-complete", label: "Orders – Complete" },
      { id: "orders-get-one", label: "Orders – Get One" },
      { id: "errors", label: "Error Handling" },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Ventor Partners API – v1</h1>
          <p className="text-gray-600 mt-1">Vendor-facing API for product sync and order intake between Vendor ERPs and Ventor.</p>
        </div>
        <nav className="hidden md:block min-w-[260px]">
          <div className="sticky top-6 border rounded-xl p-4 bg-white/70 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">On this page</p>
            <ul className="space-y-2 text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="hover:underline">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="prose prose-slate max-w-none">
        <Anchor id="intro" />
        <h2>Intro</h2>
        <p>
          <strong>Base URL:</strong> <code>{baseUrl}</code>
        </p>
        <p>
          Οι ακόλουθες προδιαγραφές αντιστοιχούν στο vendor-facing API
          για καταχώρηση/ενημέρωση προϊόντων και ανάκτηση/ολοκλήρωση παραγγελιών.
        </p>

        <Anchor id="auth" />
        <h2>Authentication</h2>
        <p>
          Όλα τα αιτήματα απαιτούν header <code>{apiKeyVar}</code>.
        </p>
        <div className="not-prose grid gap-2">
          <KVP k="Header" v={`${apiKeyVar}: YOUR_API_KEY`} />
          <KVP k="Content-Type" v="application/json" />
        </div>

        <Anchor id="products-upsert" />
        <h2>Products – Upsert</h2>
        <p>
          <strong>POST</strong> <code>/store/partners/products</code>
        </p>
        <p>
          Αν υπάρχει ήδη προϊόν με το ίδιο <code>id</code>, ενημερώνεται — αλλιώς δημιουργείται νέο. Κανόνας null πεδίων: τα {' '}
          <code>price</code>, <code>quantity</code>, <code>barcode</code>, <code>sku</code> είναι υποχρεωτικά στο root όταν δεν υπάρχουν
          {' '}<code>variations</code>. Όταν υπάρχουν  {' '}<code>variations</code>, μπορούν να είναι <code>null</code> στο root.
        </p>
        <h4>Payload Schema (TypeScript)</h4>
        <CodeBlock lang="ts" code={productPayloadTs} />
        <h4>cURL</h4>
        <CodeBlock code={curl.upsert} />

        <Anchor id="products-delete" />
        <h2>Products – Delete</h2>
        <p>
          <strong>DELETE</strong> <code>/store/partners/products/delete/:id</code> (soft delete). 200 αν επιτυχές, 404 αν δεν βρεθεί.
        </p>
        <CodeBlock code={curl.delete} />

        <Anchor id="orders-pending" />
        <h2>Orders – Get Pending</h2>
        <p>
          <strong>GET</strong> <code>/store/partners/orders/pending</code>
        </p>
        <h4>Response Schema (TypeScript)</h4>
        <CodeBlock lang="ts" code={ordersPendingSchema} />
        <h4>cURL</h4>
        <CodeBlock code={curl.pending} />

        <Anchor id="orders-complete" />
        <h2>Orders – Complete</h2>
        <p>
          <strong>PUT</strong> <code>/store/partners/orders/complete/:id</code> — Ολοκλήρωση παραγγελίας αφού καταχωρηθεί στο ERP. Αν είναι ήδη
          completed, επιστρέφεται ενημερωτικό μήνυμα.
        </p>
        <CodeBlock code={curl.complete} />

        <Anchor id="orders-get-one" />
        <h2>Orders – Get One</h2>
        <p>
          <strong>GET</strong> <code>/store/partners/orders/:id</code>
        </p>
        <h4>Response Schema (TypeScript)</h4>
        <CodeBlock lang="ts" code={orderSchema} />
        <h4>cURL</h4>
        <CodeBlock code={curl.getOne} />

        <Anchor id="errors" />
        <h2>Error Handling</h2>
        <ul>
          <li><code>400 Bad Request</code> – Λανθασμένο payload (π.χ. λείπουν υποχρεωτικά πεδία όταν δεν υπάρχουν variations).</li>
          <li><code>401 Unauthorized</code> – Έλλειψη/invalid <code>{apiKeyVar}</code>.</li>
          <li><code>403 Forbidden</code> – Πόρος εκτός vendor scope.</li>
          <li><code>404 Not Found</code> – Πόρος δεν βρέθηκε.</li>
        </ul>
      </main>

      <footer className="mt-16 text-xs text-gray-500">
        v1 · Generated from Postman collection · © Ventor
      </footer>
    </div>
  );
}
