// // import { useState } from "react";
// // import { Configuration, OpenAIApi } from "openai";
// import { useEffect, useState } from "react"
// import { OpenAI } from "openai"

// export default function Chat() {
//     const [message, setMessage] = useState("");
//     const [response, setResponse] = useState("");
//     const [loading, setLoading] = useState(false);

//     // Configuração da API da OpenAI



//     const openai = new OpenAI({
//         apiKey: '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',//process.env.OPENAI_API_KEY, // Chave no .env.local
//     });

//     const sendMessage = async () => {
//         if (!message.trim()) return;
//         setLoading(true);
//         setResponse("");

//         try {
//             const res = await openai.chat.completions.create({
//                 model: "gpt-4",
//                 messages: [
//                     { role: "system", content: "Você é um atendente de suporte ao cliente educado e prestativo." },
//                     { role: "user", content: message },
//                 ],
//                 max_tokens: 500,
//             });

//             setResponse(res.choices[0].message.content);
//         } catch (error) {
//             console.error("Erro na API OpenAI:", error);
//             setResponse("Erro ao se comunicar com o suporte.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-4 max-w-md mx-auto">
//             <h1 className="text-xl font-bold mb-4">Atendimento ao Cliente</h1>
//             <textarea
//                 className="w-full border p-2 rounded text-black"
//                 rows="4"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Digite sua dúvida..."
//             />
//             <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
//                 onClick={sendMessage}
//                 disabled={loading}
//             >
//                 {loading ? "Enviando..." : "Enviar"}
//             </button>
//             {response && (
//                 <div className="mt-4 p-3 bg-gray-100 border rounded text-black">{response}</div>
//             )}
//         </div>
//     );
// }
