"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function EmitirCertificado() {
  const { address } = useAccount();
  const [direccionEstudiante, setDireccionEstudiante] = useState("");
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [carrera, setCarrera] = useState("");
  const [institucion, setInstitucion] = useState("");

  const { data: owner } = useScaffoldReadContract({
    contractName: "CertificadosAcademicos",
    functionName: "owner",
  });

  const { data: totalCertificados } = useScaffoldReadContract({
    contractName: "CertificadosAcademicos",
    functionName: "totalCertificados",
  });

  const { writeContractAsync: emitirCertificado } = useScaffoldWriteContract("CertificadosAcademicos");

  const handleEmitir = async () => {
    if (!direccionEstudiante || !nombreEstudiante || !carrera || !institucion) {
      notification.error("Por favor completa todos los campos");
      return;
    }

    if (direccionEstudiante.length !== 42 || !direccionEstudiante.startsWith("0x")) {
      notification.error("Dirección Ethereum inválida");
      return;
    }

    try {
      await emitirCertificado({
        functionName: "emitirCertificado",
        args: [direccionEstudiante, nombreEstudiante, carrera, institucion],
      });

      notification.success("¡Certificado emitido exitosamente!");

      setDireccionEstudiante("");
      setNombreEstudiante("");
      setCarrera("");
      setInstitucion("");
    } catch (error) {
      console.error("Error al emitir certificado:", error);
    }
  };

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">🎓 Emitir Certificado</span>
            <span className="block text-2xl mt-2">Panel de Administración</span>
          </h1>
          <div className="alert alert-warning max-w-2xl mx-auto">
            <span>Por favor conecta tu wallet para continuar</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">🎓 Emitir Certificado</span>
            <span className="block text-2xl mt-2">Panel de Administración</span>
          </h1>
          <div className="alert alert-error max-w-2xl mx-auto">
            <span>Solo el administrador del contrato puede emitir certificados.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">🎓 Emitir Certificado</span>
          <span className="block text-2xl mt-2">Panel de Administración</span>
        </h1>

        <div className="stats shadow w-full mb-8">
          <div className="stat">
            <div className="stat-title">Total Certificados Emitidos</div>
            <div className="stat-value text-primary">{totalCertificados?.toString() || "0"}</div>
          </div>
        </div>

        <div className="bg-base-100 rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Nuevo Certificado</h2>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Dirección del Estudiante</span>
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="input input-bordered w-full"
              value={direccionEstudiante}
              onChange={e => setDireccionEstudiante(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Nombre del Estudiante</span>
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className="input input-bordered w-full"
              value={nombreEstudiante}
              onChange={e => setNombreEstudiante(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Carrera</span>
            </label>
            <input
              type="text"
              placeholder="Ingeniería en Sistemas"
              className="input input-bordered w-full"
              value={carrera}
              onChange={e => setCarrera(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-semibold">Institución</span>
            </label>
            <input
              type="text"
              placeholder="Universidad Tecnológica"
              className="input input-bordered w-full"
              value={institucion}
              onChange={e => setInstitucion(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-lg w-full" onClick={handleEmitir}>
            🎓 Emitir Certificado NFT
          </button>
        </div>
      </div>
    </div>
  );
}
