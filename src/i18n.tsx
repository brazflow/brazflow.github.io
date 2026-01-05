import React, { createContext, useContext, useState } from 'react'

const translations: any = {
  'en-US': {
    quick_run: 'Quick Run', latitude: 'Latitude', longitude: 'Longitude', run: 'Run',
    upload_shapefile: 'Upload Shapefile (.zip)', upload: 'Upload',
    results: 'Results', status: 'Status', download: 'Download', logs: 'Logs',
    method_map: 'Click on map',
    method_coords: 'Enter coordinates manually',
    method_shp: 'Upload shapefile (.zip)',
    method_kmz: 'Upload KMZ',
    use_coords_button: 'Use coordinates',
    run_button_label: 'Run model',
    latitude_label: 'Latitude (Y)',
    longitude_label: 'Longitude (X)',
    load_run_by_id: 'Load run by ID',
    input_selection: 'Input selection',
    model_selection_label: 'Model',
    invalid_coordinates: 'Invalid coordinates',
    failed_to_create_job: 'Failed to create job',
    copyright: '© 2026 BrazFlow. All rights reserved.',
    go: 'Go',
    no_summary_available: 'No summary available',
    error: 'Error',
    simulation_results: 'Simulation Results',
    download_results: 'Download Results',
    hide_log_details: 'Hide Log Details',
    show_log_details: 'Show Log Details',
    polling_for_status: 'Polling for status...',
    status_label: 'Status:',
    loading: 'Loading...',
    job_running: 'Job is running, results will appear when complete.',
    job_failed: 'Job failed:',
    hydrological_signatures: 'Hydrological Signatures',
    no_results_available: 'No results available.',
  },
  'pt-BR': {
    quick_run: 'Execução Rápida', latitude: 'Latitude', longitude: 'Longitude', run: 'Rodar',
    upload_shapefile: 'Enviar Shapefile (.zip)', upload: 'Enviar',
    results: 'Resultados', status: 'Status', download: 'Baixar', logs: 'Logs',
    method_map: 'Clicar no mapa',
    method_coords: 'Inserir coordenadas manualmente',
    method_shp: 'Carregar shapefile (.zip)',
    method_kmz: 'Carregar KMZ',
    use_coords_button: 'Usar coordenadas',
    run_button_label: 'Rodar modelagem',
    latitude_label: 'Latitude (Y)',
    longitude_label: 'Longitude (X)',
    load_run_by_id: 'Carregar execução por ID',
    input_selection: 'Seleção de entrada',
    model_selection_label: 'Modelo',
    invalid_coordinates: 'Coordenadas inválidas',
    failed_to_create_job: 'Falha ao criar trabalho',
    copyright: '© 2026 BrazFlow. Todos os direitos reservados.',
    go: 'Ir',
    no_summary_available: 'Nenhum resumo disponível',
    error: 'Erro',
    simulation_results: 'Resultados da Simulação',
    download_results: 'Baixar Resultados',
    hide_log_details: 'Ocultar Detalhes do Log',
    show_log_details: 'Mostrar Detalhes do Log',
    polling_for_status: 'Aguardando status...',
    status_label: 'Status:',
    loading: 'Carregando...',
    job_running: 'Trabalho em execução, resultados aparecerão quando concluído.',
    job_failed: 'Trabalho falhou:',
    hydrological_signatures: 'Assinaturas Hidrológicas',
    no_results_available: 'Nenhum resultado disponível.',
  }
}

const I18nContext = createContext<any>({ locale: 'en-US', t: (k: string) => k, setLocale: (_l: string) => {} })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'en-US' | 'pt-BR'>('en-US')
  const t = (key: string) => translations[locale][key] ?? key
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() { return useContext(I18nContext) }
