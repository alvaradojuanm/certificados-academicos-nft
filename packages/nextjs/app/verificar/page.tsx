"use client";

import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function VerificarCertificado() {
  const [tokenId, setTokenId] = useState("");
  const [searchId, setSearchId] = useState<string>("");

  const { data: certificado } = useScaffoldReadContract({
    contractName: "CertificadosAcademicos",
    functionName: "verificarCertificado",
    args: searchId ? [BigInt(searchId)] : undefined,
  });

  const handleVerificar = () => {
    if (tokenId) {
      setSearchId(tokenId);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">🎓 Verificar Certificado</span>
          <span className="block text-2xl mt-2">Sistema de Certificados Académicos NFT</span>
        </h1>

        <div className="bg-base-100 rounded-3xl shadow-xl p-8 mb-8">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-lg font-semibold">ID del Certificado</span>
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Ingresa el ID del certificado (ejemplo: 0)"
                className="input input-bordered input-lg flex-grow"
                value={tokenId}
                onChange={e => setTokenId(e.target.value)}
              />
              <button className="btn btn-primary btn-lg" onClick={handleVerificar}>
                🔍 Verificar
              </button>
            </div>
          </div>
        </div>

        {searchId && certificado && (
          <div className="bg-base-100 rounded-3xl shadow-xl p-8">
            {certificado[0] ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">Certificado Encontrado</h2>
                  {certificado[1] ? (
                    <div className="badge badge-success badge-lg gap-2">✅ VÁLIDO</div>
                  ) : (
                    <div className="badge badge-error badge-lg gap-2">❌ REVOCADO</div>
                  )}
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estudiante</p>
                    <p className="text-xl font-semibold">{certificado[2]}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Carrera</p>
                    <p className="text-xl font-semibold">{certificado[3]}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Institución</p>
                    <p className="text-xl font-semibold">{certificado[4]}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fecha de Emisión</p>
                    <p className="text-xl font-semibold">
                      {new Date(Number(certificado[5]) * 1000).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Propietario (Dirección Blockchain)</p>
                    <p className="text-lg font-mono bg-base-200 p-3 rounded-lg break-all">{certificado[6]}</p>
                  </div>
                </div>

                <div className="alert alert-info mt-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>
                    Este certificado está registrado en blockchain y es completamente verificable e inmutable.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl font-bold text-error mb-4">❌ Certificado no encontrado</p>
                <p className="text-lg">El ID {searchId} no corresponde a ningún certificado emitido.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
