import streamlit as st
import folium
from streamlit_folium import st_folium
import subprocess
import pandas as pd
from pathlib import Path
import shutil
import io
import zipfile
import time
import geopandas as gpd
import xml.etree.ElementTree as ET
import base64

# --- I18N TEXTS ---
TEXTS = {
    "pt-BR": {
        "page_title": "BrazFlow - Análise de Disponibilidade Hídrica",
        "sidebar_title": "🌊 BrazFlow",
        "info_popover": """**Bem-vindo ao HydroDash!**

**Fonte dos Dados:** Use esta barra lateral para escolher sua entrada (mapa, coordenadas ou arquivo).

**Executar Análise:** Após fornecer os dados, clique em 'Rodar Modelagem'.

**Resultados:** Acompanhe o progresso e visualize os resultados no painel principal à direita.

**Download:** Após a análise, baixe os resultados no botão no final desta barra lateral.""",
        "header_data_source": "1. Fonte dos Dados",
        "radio_input_method": "Escolha como fornecer a bacia hidrográfica:",
        "method_map": "Clicar no Mapa",
        "method_coords": "Inserir Coordenadas",
        "method_shp": "Carregar Shapefile (.zip)",
        "method_kmz": "Carregar KMZ",
        "expander_coords": "Inserir Coordenadas Manualmente",
        "latitude_label": "Latitude (Y)",
        "longitude_label": "Longitude (X)",
        "use_coords_button": "Usar Coordenadas",
        "expander_shp": "Upload de Shapefile",
        "uploader_shp": "Arquivo .zip contendo o shapefile da bacia",
        "shp_area_detected": "Área detectada em '{file_name}'.",
        "shp_point_detected": "Ponto detectado em '{file_name}'.",
        "expander_kmz": "Upload de KMZ",
        "uploader_kmz": "Arquivo .kmz contendo a área ou ponto de análise",
        "kmz_area_detected": "Área detectada em '{file_name}'.",
        "kmz_point_detected": "Ponto detectado em '{file_name}'.",
        "header_run_analysis": "2. Executar Análise",
        "run_button_label": "Rodar Modelagem Hidrológica",
        "header_download": "3. Baixar Resultados",
        "download_ready_button": "Download (.zip)",
        "download_wait_button": "Aguarde a modelagem",
        "main_title": "Análise de Disponibilidade Hídrica",
        "subheader_location": "Localização",
        "map_marker_popup": "Ponto Selecionado",
        "map_geojson_name": "Bacia Hidrográfica",
        "subheader_processing": "Processando Análise...",
        "spinner_text": "Aguarde, o modelo está em execução. Isso pode levar alguns minutos.",
        "success_message": "Análise concluída com sucesso!",
        "error_message": "A análise falhou. Verifique o log para mais detalhes.",
        "subheader_results": "Resultados da Análise",
        "watershed_area_label": "##### Área da Bacia: `{area:,.2f} km²`",
        "hydro_signatures_subheader": "##### Assinaturas Hidrológicas",
        "metrics_display_error": "Não foi possível exibir as assinaturas como métricas.",
        "figures_subheader": "##### Figuras",
        "waiting_for_input": "Aguardando entrada de dados para iniciar a análise."
    },
    "en-US": {
        "page_title": "BrazFlow - Water Availability Analysis",
        "sidebar_title": "🌊 BrazFlow",
        "info_popover": """**Welcome to HydroDash!**

**Data Source:** Use this sidebar to choose your input (map, coordinates, or file).

**Run Analysis:** After providing the data, click 'Run Modeling'.

**Results:** Track progress and view results in the main panel on the right.

**Download:** After the analysis, download the results using the button at the bottom of this sidebar.""",
        "header_data_source": "1. Data Source",
        "radio_input_method": "Choose how to provide the watershed:",
        "method_map": "Click on Map",
        "method_coords": "Enter Coordinates",
        "method_shp": "Upload Shapefile (.zip)",
        "method_kmz": "Upload KMZ",
        "expander_coords": "Enter Coordinates Manually",
        "latitude_label": "Latitude (Y)",
        "longitude_label": "Longitude (X)",
        "use_coords_button": "Use Coordinates",
        "expander_shp": "Shapefile Upload",
        "uploader_shp": ".zip file containing the watershed shapefile",
        "shp_area_detected": "Area detected in '{file_name}'.",
        "shp_point_detected": "Point detected in '{file_name}'.",
        "expander_kmz": "KMZ Upload",
        "uploader_kmz": "KMZ file containing the analysis area or point",
        "kmz_area_detected": "Area detected in '{file_name}'.",
        "kmz_point_detected": "Point detected in '{file_name}'.",
        "header_run_analysis": "2. Run Analysis",
        "run_button_label": "Run Hydrological Modeling",
        "header_download": "3. Download Results",
        "download_ready_button": "Download (.zip)",
        "download_wait_button": "Waiting for modeling",
        "main_title": "Water Availability Analysis",
        "subheader_location": "Location",
        "map_marker_popup": "Selected Point",
        "map_geojson_name": "Watershed",
        "subheader_processing": "Processing Analysis...",
        "spinner_text": "Please wait, the model is running. This may take a few minutes.",
        "success_message": "Analysis completed successfully!",
        "error_message": "Analysis failed. Check the log for more details.",
        "subheader_results": "Analysis Results",
        "watershed_area_label": "##### Watershed Area: `{area:,.2f} sq km`",
        "hydro_signatures_subheader": "##### Hydrological Signatures",
        "metrics_display_error": "Could not display signatures as metrics.",
        "figures_subheader": "##### Figures",
        "waiting_for_input": "Waiting for data input to start the analysis."
    }
}

# --- Language Setup ---
if 'lang' not in st.session_state:
    st.session_state.lang = 'pt-BR'

def get_text(key):
    return TEXTS[st.session_state.lang][key]

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title=get_text("page_title"),
    page_icon="🌊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --- STYLING ---
CSS = """@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
}

section[data-testid="stSidebar"] {
    width: 350px !important; /* Increase sidebar width */
}

.stApp {
    background-color: #1A1A2E; /* Deep blue background */
    color: #E0E0E0;
}

.stSidebar {
    background-color: #16213E;
}

h1, h2, h3, h4, h5, h6 {
    color: #FFFFFF !important;
}

/* Make columns equal height */
div[data-testid="stHorizontalBlock"] > div {
    display: flex;
    flex-direction: column;
}

.card {
    background-color: #0F3460;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 10px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    border: 1px solid #5372F0;
    height: 100%; /* Make card fill the column */
}

.stButton>button {
    background-color: #5372F0;
    color: white;
    border-radius: 5px;
    border: none;
}

.stButton>button:hover {
    background-color: #425bbf;
    color: white;
}

.stSpinner>div>div {
    border-top-color: #5372F0 !important;
}

/* Style for the custom green download link */
.download-link-green {
    background-color: #28a745;
    color: white !important;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none !important;
    display: block;
    text-align: center;
    transition: background-color 0.3s;
}
.download-link-green:hover {
    background-color: #218838;
    color: white !important;
    text-decoration: none !important;
}

# .small-signature-label {
#     font-size: 14; /* Adjust as needed */
#     color: #E0E0E0; /* Ensure visibility against dark background */
# }
"""
st.markdown(f'<style>{CSS}</style>', unsafe_allow_html=True)

# --- HELPER FUNCTIONS (unchanged) ---
def zip_directory(path):
    data = io.BytesIO()
    with zipfile.ZipFile(data, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in path.rglob('*'):
            z.write(f, f.relative_to(path))
    data.seek(0)
    return data

def find_files(directory, extensions):
    files = []
    if not Path(directory).is_dir():
        return files
    for ext in extensions:
        files.extend(list(Path(directory).rglob(f'*{ext}')))
    return files

def load_basin_geojson(run_dir):
    shp_files = find_files(run_dir, ['.shp'])
    if shp_files:
        shp_path = shp_files[0]
        try:
            gdf = gpd.read_file(shp_path)
            if not gdf.empty and not gdf.geometry.empty:
                if gdf.crs.is_geographic:
                    gdf_proj = gdf.to_crs(gdf.estimate_utm_crs())
                else:
                    gdf_proj = gdf.copy()
                area_km2 = gdf_proj.geometry.area.sum() / 1e6
                return gdf.to_json(), area_km2
        except Exception as e:
            st.error(f"Error reading shapefile {shp_path}: {e}")
    return None, None

# --- SESSION STATE INITIALIZATION ---
states = {
    'clicked_point': None,
    'process_running': False,
    'process_done': False,
    'run_dir': None,
    'basin_geojson': None,
    'area_bacia': None,
    'uploaded_shp_path': None,
    'last_uploaded_zip_name': None,
    'fit_bounds': None,
    'process': None,      # To hold the subprocess object
    'run_id': None,       # To uniquely identify a run
    'last_log_line': ''   # To store the last log line
}
for key, value in states.items():
    if key not in st.session_state:
        st.session_state[key] = value

# --- SIDEBAR ---
with st.sidebar:
    title_cols = st.columns([0.8, 0.2])
    with title_cols[0]:
        st.title(get_text("sidebar_title"))
    with title_cols[1]:
        st.write("") # Spacer
        # with st.popover("ℹ️", use_container_width=False):
        #     st.markdown(get_text("info_popover"))

    st.header(get_text("header_data_source"))

    METHOD_KEYS = ["map", "coords", "shp", "kmz"]
    def format_method(key):
        return get_text(f"method_{key}")

    # If the stored value is the old text-based value, reset to default.
    # This ensures a clean transition from the old version.
    if st.session_state.get('input_method') not in METHOD_KEYS:
        st.session_state.input_method = METHOD_KEYS[0]

    input_method = st.radio(
        get_text("radio_input_method"),
        options=METHOD_KEYS,
        format_func=format_method,
        key='input_method'
    )

    if input_method == "coords":
        with st.expander(get_text("expander_coords"), expanded=True):
            default_lat = st.session_state.clicked_point[0] if st.session_state.clicked_point else -10.0
            manual_lat = st.number_input(get_text("latitude_label"), format="%.4f", value=default_lat)
            default_lon = st.session_state.clicked_point[1] if st.session_state.clicked_point else -44.0
            manual_lon = st.number_input(get_text("longitude_label"), format="%.4f", value=default_lon)
            if st.button(get_text("use_coords_button")):
                new_point = (manual_lat, manual_lon)
                if new_point != st.session_state.clicked_point:
                    run_dir_name = f"bacia_{new_point[0]:.4f}_{new_point[1]:.4f}".replace('.', '_')
                    st.session_state.update(
                        clicked_point=new_point, 
                        uploaded_shp_path=None, 
                        last_uploaded_zip_name=None, 
                        fit_bounds=None, 
                        process_done=False,
                        run_dir=Path(f"./output/{run_dir_name}")
                    )
                    st.rerun()

    elif input_method == "shp":
        with st.expander(get_text("expander_shp"), expanded=True):
            uploaded_file = st.file_uploader(get_text("uploader_shp"), type=['zip'])
            if uploaded_file and uploaded_file.name != st.session_state.get('last_uploaded_zip_name'):
                temp_dir = Path(f"./tmp_uploads/{Path(uploaded_file.name).stem}")
                if temp_dir.exists(): shutil.rmtree(temp_dir)
                temp_dir.mkdir(parents=True, exist_ok=True)
                with zipfile.ZipFile(io.BytesIO(uploaded_file.getvalue()), 'r') as z:
                    z.extractall(temp_dir)
                shp_files = list(temp_dir.glob("*.shp"))
                if shp_files:
                    gdf = gpd.read_file(shp_files[0])
                    geom_types = gdf.geom_type.unique()
                    if any(g in ['Polygon', 'MultiPolygon'] for g in geom_types):
                        st.success(get_text("shp_area_detected").format(file_name=uploaded_file.name))
                        bounds = gdf.total_bounds
                        st.session_state.update(
                            uploaded_shp_path=str(shp_files[0].resolve()),
                            run_dir=Path(f"./output/bacia_{Path(uploaded_file.name).stem}"),
                            last_uploaded_zip_name=uploaded_file.name, clicked_point=None,
                            basin_geojson=gdf.to_json(), area_bacia=(gdf.to_crs(gdf.estimate_utm_crs()).area.sum()/1e6),
                            fit_bounds=[[bounds[1], bounds[0]], [bounds[3], bounds[2]]], process_done=False
                        )
                        st.rerun()
                    elif 'Point' in geom_types:
                        st.success(get_text("shp_point_detected").format(file_name=uploaded_file.name))
                        pt = gdf.geometry.iloc[0]
                        st.session_state.update(clicked_point=(pt.y, pt.x), uploaded_shp_path=None, last_uploaded_zip_name=None, fit_bounds=None, process_done=False)
                        st.rerun()

    elif input_method == "kmz":
        with st.expander(get_text("expander_kmz"), expanded=True):
            uploaded_file = st.file_uploader(get_text("uploader_kmz"), type=['kmz'])
            if uploaded_file and uploaded_file.name != st.session_state.get('last_uploaded_zip_name'):
                temp_dir_kmz = Path(f"./tmp_uploads/{Path(uploaded_file.name).stem}_kmz")
                if temp_dir_kmz.exists(): shutil.rmtree(temp_dir_kmz)
                temp_dir_kmz.mkdir(parents=True, exist_ok=True)
                with zipfile.ZipFile(io.BytesIO(uploaded_file.getvalue()), 'r') as z:
                    z.extractall(temp_dir_kmz)
                kml_files = list(temp_dir_kmz.glob("*.kml"))
                if kml_files:
                    gpd.io.file.fiona.drvsupport.supported_drivers['KML'] = 'r'
                    gdf = gpd.read_file(kml_files[0])
                    geom_types = gdf.geom_type.unique()
                    if any(g in ['Polygon', 'MultiPolygon'] for g in geom_types):
                        st.success(get_text("kmz_area_detected").format(file_name=uploaded_file.name))
                        temp_dir_shp = Path(f"./tmp_uploads/{Path(uploaded_file.name).stem}_shp")
                        if temp_dir_shp.exists(): shutil.rmtree(temp_dir_shp)
                        temp_dir_shp.mkdir(parents=True, exist_ok=True)
                        new_shp_path = temp_dir_shp / f"{Path(uploaded_file.name).stem}.shp"
                        gdf.to_file(new_shp_path)
                        bounds = gdf.total_bounds
                        st.session_state.update(
                            uploaded_shp_path=str(new_shp_path.resolve()),
                            run_dir=Path(f"./output/bacia_{Path(uploaded_file.name).stem}"),
                            last_uploaded_zip_name=uploaded_file.name, clicked_point=None,
                            basin_geojson=gdf.to_json(), area_bacia=(gdf.to_crs(gdf.estimate_utm_crs()).area.sum()/1e6),
                            fit_bounds=[[bounds[1], bounds[0]], [bounds[3], bounds[2]]], process_done=False
                        )
                        st.rerun()
                    elif 'Point' in geom_types:
                        st.success(get_text("kmz_point_detected").format(file_name=uploaded_file.name))
                        pt = gdf.geometry.iloc[0]
                        st.session_state.update(clicked_point=(pt.y, pt.x), uploaded_shp_path=None, last_uploaded_zip_name=None, fit_bounds=None, process_done=False)
                        st.rerun()

    st.header(get_text("header_run_analysis"))
    run_disabled = not (st.session_state.clicked_point or st.session_state.uploaded_shp_path)
    if st.button(get_text("run_button_label"), type="primary", disabled=run_disabled, use_container_width=True):
        # Set the state to start the process on the next script run
        st.session_state.process_running = True
        st.session_state.process_done = False
        st.session_state.process = None  # Clear any previous process
        st.session_state.log_lines = [] # Clear previous logs
        
        # Explicitly set run_dir here to ensure it's always valid
        if input_method == "map" or input_method == "coords":
            if st.session_state.clicked_point:
                new_lat, new_lon = st.session_state.clicked_point
                run_dir_name = f"bacia_{new_lat:.4f}_{new_lon:.4f}".replace('.', '_')
                st.session_state.run_dir = Path(f"./output/{run_dir_name}")
            else:
                st.error("Por favor, selecione um ponto no mapa ou insira as coordenadas.")
                st.session_state.process_running = False
        
        elif st.session_state.uploaded_shp_path:
             # For shapefile/kmz, run_dir should already be set
             pass
        
        if not st.session_state.uploaded_shp_path:
            st.session_state.basin_geojson = None
        
        # No st.rerun() here - let Streamlit rerun automatically
        # This is the key to letting the UI update before the process starts
        
    st.header(get_text("header_download"))
    if st.session_state.process_done:
        run_dir = st.session_state.run_dir
        zip_bytes = zip_directory(run_dir)
        zip_filename = f"results_{run_dir.name}.zip"
        b64 = base64.b64encode(zip_bytes.getvalue()).decode()
        href = f'<a href="data:application/zip;base64,{b64}" download="{zip_filename}" class="download-link-green">{get_text("download_ready_button")}</a>'
        st.markdown(href, unsafe_allow_html=True)
    else:
        st.button(get_text("download_wait_button"), use_container_width=True, disabled=True)

    st.markdown("---")
    selected_lang_label = st.radio(
        "Idioma / Language",
        ('\U0001F1E7\U0001F1F7 Português', '\U0001F1FA\U0001F1F8 English'),
        key='lang_selector'
    )
    if "Português" in selected_lang_label:
        st.session_state.lang = 'pt-BR'
    else:
        st.session_state.lang = 'en-US'

# --- MAIN PANEL ---
st.title(get_text("main_title"))

col_map, col_results = st.columns([0.6, 0.4])

with col_map:
    st.subheader(get_text("subheader_location"))
    center_loc = [-14.2350, -51.9253]
    zoom = 4
    if st.session_state.clicked_point:
        center_loc = st.session_state.clicked_point
        zoom = 10

    # Esri Satellite as default
    ESRI_TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ESRI_TILE_ATTR = 'Esri'

    m = folium.Map(location=center_loc, zoom_start=zoom, tiles=ESRI_TILE_URL, attr=ESRI_TILE_ATTR)
    
    # Add other tile layers as options
    folium.TileLayer('OpenStreetMap').add_to(m)
    folium.TileLayer('CartoDB dark_matter').add_to(m)

    if st.session_state.clicked_point:
        folium.Marker(st.session_state.clicked_point, popup=get_text("map_marker_popup")).add_to(m)
    if st.session_state.basin_geojson:
        folium.GeoJson(st.session_state.basin_geojson, name=get_text("map_geojson_name"), style_function=lambda x: {'fillColor': "#5372F0", 'color': 'white', 'weight': 2, 'fillOpacity': 0.3}).add_to(m)
    
    folium.LayerControl().add_to(m)
    if st.session_state.get('fit_bounds'):
        m.fit_bounds(st.session_state.fit_bounds)

    map_output = st_folium(m, width='100%', height=700)

    if map_output and map_output['last_clicked'] and input_method == "map":
        new_click = (map_output['last_clicked']['lat'], map_output['last_clicked']['lng'])
        if new_click != st.session_state.clicked_point:
            run_dir_name = f"bacia_{new_click[0]:.4f}_{new_click[1]:.4f}".replace('.', '_')
            st.session_state.update(
                clicked_point=new_click, 
                uploaded_shp_path=None, 
                last_uploaded_zip_name=None, 
                fit_bounds=None, 
                process_done=False,
                run_dir=Path(f"./output/{run_dir_name}")
            )
            st.rerun()

with col_results:
    if st.session_state.process_running:
        st.subheader(get_text("subheader_processing"))
        log_placeholder = st.empty()

        # If process is not started, start it
        if st.session_state.get('process') is None:
            with st.spinner(get_text("spinner_text")):
                run_dir = st.session_state.run_dir
                command = ["python", "-u", "backend_pipeline.py", "--run-dir", str(run_dir)]
                if st.session_state.uploaded_shp_path:
                    command.extend(["--shapefile-path", st.session_state.uploaded_shp_path])
                elif st.session_state.clicked_point:
                    command.extend(["--x", str(st.session_state.clicked_point[1]), "--y", str(st.session_state.clicked_point[0])])
                
                # Start the process and store it in session state
                st.session_state.process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
                st.rerun() # Rerun to start monitoring

        # If process is running, monitor it
        else:
            with st.spinner(get_text("spinner_text")):
                log_placeholder.text(st.session_state.last_log_line)

                # Check if process is still running
                while st.session_state.process.poll() is None:
                    try:
                        line = st.session_state.process.stdout.readline()
                        if line:
                            st.session_state.last_log_line = line.strip()
                            log_placeholder.text(st.session_state.last_log_line)
                        else:
                            # Break if readline returns empty string (process finished)
                            break
                        time.sleep(0.1) # Prevent a tight loop
                    except Exception:
                        break # End loop if any error occurs
                
                # Process finished
                st.session_state.process.wait() # Ensure process is fully finished
                if st.session_state.process.returncode == 0:
                    st.success(get_text("success_message"))
                    st.session_state.basin_geojson, st.session_state.area_bacia = load_basin_geojson(st.session_state.run_dir)
                else:
                    st.error(get_text("error_message"))
                    # Display final logs in case of error
                    log_placeholder.text(st.session_state.last_log_line)

                # Reset state and rerun to show results
                st.session_state.process_running = False
                st.session_state.process_done = True
                st.session_state.process = None
                st.session_state.last_log_line = ""
                st.rerun()

    elif st.session_state.process_done:
        st.subheader(get_text("subheader_results"))
        run_dir = st.session_state.run_dir
        if st.session_state.area_bacia:
            st.markdown(get_text("watershed_area_label").format(area=st.session_state.area_bacia))
        
        sig_files = find_files(run_dir, ['hydro_signatures.csv'])
        if sig_files:
            st.markdown(get_text("hydro_signatures_subheader"))
            df_sigs = pd.read_csv(sig_files[0], sep='\t')
            
            # Filter out the 'Best_Fit' column for metric display
            display_sigs = df_sigs.drop(columns=[col for col in ['Q7,10_Best_Fit'] if col in df_sigs.columns])

            try:
                sig_values = display_sigs.iloc[0].to_dict()
                unitless_metrics = ['BFI']
                
                # Prepare Q7,10 analysis data for tooltip
                q710_analysis_files = find_files(run_dir, ['q7_10_analysis_results.csv'])
                q710_tooltip = "Análise detalhada da Q7,10 não disponível."
                if q710_analysis_files:
                    df_q710_analysis = pd.read_csv(q710_analysis_files[0], sep='\t')
                    best_fit_dist = df_sigs.get('Q7,10_Best_Fit', pd.Series(["N/A"])).iloc[0]
                    
                    # Reconstruct the tooltip string with explicit newlines
                    q710_tooltip = f"Melhor ajuste: {best_fit_dist}\n---\n"
                    for _, row in df_q710_analysis.iterrows():
                        q_val = row['Q7_10']
                        p_val = f"{row['P_Value']:.3f}" if isinstance(row['P_Value'], float) else row['P_Value']
                        q710_tooltip += f"{row['Distribution']}: Q7,10={q_val}, P-Value={p_val}\n---\n"
                    # Remove the final newline
                    q710_tooltip = q710_tooltip.strip()

                cols = st.columns(3)
                i = 0
                for name, value in sig_values.items():
                    col_index = i % 3
                    display_name = name.replace("_", " ").title()
                    
                    with cols[col_index]:
                        # Display Q7,10 as a standard signature with a tooltip
                        if name.lower() == 'q7,10':
                            display_name = 'Q7,10'
                            # st.markdown(f'<span class="small-signature-label">{display_name}:</span> `{value:.2f} m³/s`', unsafe_allow_html=True, help=q710_tooltip)
                            st.markdown(f'{display_name}: `{value:.2f} m³/s`', unsafe_allow_html=True, help=q710_tooltip)
                        # Standard display for other metrics
                        else:
                            if name in unitless_metrics:
                                # st.markdown(f'<span class="small-signature-label">{display_name}:</span> `{value:.2f}`', unsafe_allow_html=True)
                                st.markdown(f'{display_name}: `{value:.2f}`', unsafe_allow_html=True)
                            else:
                                # st.markdown(f'<span class="small-signature-label">{display_name}:</span> `{value:.2f} m³/s`', unsafe_allow_html=True)
                                st.markdown(f'{display_name}: `{value:.2f} m³/s`', unsafe_allow_html=True)
                    i += 1
            except Exception as e:
                st.warning(get_text("metrics_display_error"))
                st.dataframe(df_sigs, use_container_width=True)

        image_files = sorted(find_files(run_dir, ['.png', '.jpg']))
        figures_to_display = [img for img in image_files if 'delineated_catchment' not in img.name]
        if figures_to_display:
            st.markdown(get_text("figures_subheader"))
            for img_path in figures_to_display:
                st.image(str(img_path))
        
    else:
        st.subheader(get_text("subheader_results"))
        st.warning(get_text("waiting_for_input"))
