"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function MisCertificados() {
  const { address } = useAccount();

  const { data: certificadosIds } = useScaffoldReadContract({
    contractName: "CertificadosAcademicos",
    functionName: "obtenerCertificadosDeEstudiante",
    args: [address],
  });

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">🎓 Mis Certificados</span>
            <span className="block text-2xl mt-2">Certificados Académicos NFT</span>
          </h1>
          <div className="alert alert-warning max-w-2xl mx-auto">
            <span>Por favor conecta tu wallet para ver tus certificados</span>
          </div>
        </div>
      </div>
    );
  }

  if (!certificadosIds || certificadosIds.length === 0) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-full max-w-6xl">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">🎓 Mis Certificados</span>
            <span className="block text-2xl mt-2">Certificados Académicos NFT</span>
          </h1>
          <div className="alert alert-info max-w-2xl mx-auto">
            <div>
              <h3 className="font-bold">No tienes certificados aún</h3>
              <div className="text-xs">Esta wallet no posee ningún certificado académico NFT.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">🎓 Mis Certificados</span>
          <span className="block text-2xl mt-2">Certificados Académicos NFT</span>
        </h1>

        <div className="stats shadow w-full mb-8">
          <div className="stat">
            <div className="stat-title">Total de Certificados</div>
            <div className="stat-value text-primary">{certificadosIds.length}</div>
            <div className="stat-desc">Certificados en tu posesión</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificadosIds.map((tokenId: bigint) => (
            <CertificadoCard key={tokenId.toString()} tokenId={tokenId} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificadoCard({ tokenId }: { tokenId: bigint }) {
  const { data: certificado } = useScaffoldReadContract({
    contractName: "CertificadosAcademicos",
    functionName: "verificarCertificado",
    args: [tokenId],
  });

  if (!certificado) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-32 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-2xl">Certificado #{tokenId.toString()}</h2>
          {certificado[1] ? (
            <div className="badge badge-success gap-2">✅ VÁLIDO</div>
          ) : (
            <div className="badge badge-error gap-2">❌ REVOCADO</div>
          )}
        </div>

        <div className="divider my-2"></div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Estudiante</p>
            <p className="font-bold text-lg">{certificado[2]}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Carrera</p>
            <p className="font-semibold">{certificado[3]}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Institución</p>
            <p className="font-semibold">{certificado[4]}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Fecha de Emisión</p>
            <p className="font-semibold">
              {new Date(Number(certificado[5]) * 1000).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
