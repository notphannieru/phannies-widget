// script.js - Extensión Phannie's WIDGET Creator

function postGenerationCallback(response) {
    const WIDGET_START_TAG = '<WIDGET_DATA>';
    const WIDGET_END_TAG = '</WIDGET_DATA>';

    if (!response.includes(WIDGET_START_TAG)) {
        return response;
    }

    try {
        const startIndex = response.indexOf(WIDGET_START_TAG) + WIDGET_START_TAG.length;
        const endIndex = response.indexOf(WIDGET_END_TAG);
        const dataBlock = response.substring(startIndex, endIndex).trim();

        // Función para extraer el valor de cada campo usando el formato **Campo:** Valor
        const extractValue = (tag) => {
            const regex = new RegExp(`\\*\\*${tag}:\\*\\*\\s*(.*?)(?=\\s*\\*\\*|$)`, 's');
            const match = dataBlock.match(regex);
            return match ? match[1].trim() : null;
        };

        // --- Extracción de Datos ---
        const data = {};
        data.pensamientoNormal = extractValue('Pensamiento Normal');
        data.pensamientoRaro = extractValue('Pensamiento Raro');
        data.saldo = extractValue('Saldo');
        
        const transaccionesStr = extractValue('Transacciones');
        data.transacciones = transaccionesStr ? transaccionesStr.split('|').map(t => t.trim()) : [];
        
        const notificacionesStr = extractValue('Notificaciones');
        data.notificaciones = notificacionesStr ? notificacionesStr.split('|').map(n => n.trim()) : [];
        
        const busquedasStr = extractValue('Búsquedas');
        data.busquedas = busquedasStr ? busquedasStr.split('|').map(b => b.trim()) : [];

        // --- Generación de HTML dinámico ---
        let transaccionesHTML = data.transacciones.map(t => {
            const parts = t.split(';');
            const desc = parts[0].trim();
            const monto = parts.length > 1 ? parts[1].trim() : '';
            const isPositive = monto.includes('+');
            const icon = isPositive ? '🏧' : '☕'; 
            const color = isPositive ? '#0b8a3a' : '#444'; 

            return `
                <li style="display:flex; align-items:center; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">
                    <span style="font-size:14px; margin-right:6px;">${icon}</span>
                    <span style="font-weight:600; font-size:12px;">${desc}</span>
                    <span style="font-weight:700; font-size:12px; color:${color}; margin-left:auto;">${monto}</span>
                </li>
            `;
        }).join('');

        let notificacionesHTML = data.notificaciones.map(n => {
             let icon = '💬'; 
             if (n.toLowerCase().includes('instagram')) icon = '📸';
             if (n.toLowerCase().includes('recordatorio') || n.toLowerCase().includes('basura')) icon = '⚠️';

            return `<li style="font-size:12px; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">${icon} ${n}</li>`;
        }).join('');

        let busquedasHTML = data.busquedas.map(b => {
            return `<li style="font-size:12px; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">${b}</li>`;
        }).join('');

        // --- El HTML FINAL del Widget (Tu diseño) ---
        const fullHtmlWidget = `
        <div style="text-align:center; font-family:sans-serif; font-size:12px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top: 10px;">
          <div style="width:160px; background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px; text-align:left;">
            <header style="display:flex; align-items:center; margin-bottom:6px; border-bottom:1px solid #f2d7e3; padding-bottom:4px;">
              <span style="font-size:16px; margin-right:6px;">💭</span>
              <h3 style="margin:0; font-size:13px; font-weight:700;">Pensamientos</h3>
            </header>
            <p style="margin:2px 0; font-size:12px; line-height:1.3; color:#444;">"${data.pensamientoNormal}"</p>
            <p style="margin:2px 0; font-size:12px; opacity:.8;">Pensamiento raro: "${data.pensamientoRaro}"</p>
          </div>

          <div style="width:160px; background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px; text-align:left;">
            <header style="display:flex; align-items:center; margin-bottom:6px; border-bottom:1px solid #f2d7e3; padding-bottom:4px;">
              <span style="font-size:16px; margin-right:6px;">💳</span>
              <h3 style="margin:0; font-size:13px; font-weight:700;">Cartera</h3>
            </header>
            <div style="background:#ffe9f1; border:1px solid #f7c9da; border-radius:10px; padding:6px; text-align:center; margin-bottom:6px;">
              <div style="font-size:11px; opacity:.75; font-weight:600;">Saldo Disponible</div>
              <div style="font-size:18px; font-weight:700;">${data.saldo}</div>
            </div>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
              ${transaccionesHTML}
            </ul>
          </div>

          <div style="width:160px; background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px; text-align:left;">
            <header style="display:flex; align-items:center; margin-bottom:6px; border-bottom:1px solid #f2d7e3; padding-bottom:4px;">
              <span style="font-size:16px; margin-right:6px;">🔔</span>
              <h3 style="margin:0; font-size:13px; font-weight:700;">Notificaciones</h3>
            </header>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
              ${notificacionesHTML}
            </ul>
          </div>

          <div style="width:160px; background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px; text-align:left;">
            <header style="display:flex; align-items:center; margin-bottom:6px; border-bottom:1px solid #f2d7e3; padding-bottom:4px;">
              <span style="font-size:16px; margin-right:6px;">🔎</span>
              <h3 style="margin:0; font-size:13px; font-weight:700;">Búsquedas</h3>
            </header>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
              ${busquedasHTML}
            </ul>
          </div>
        </div>
        `;
        
        // Reemplaza el bloque de datos de texto por el HTML formateado.
        const fullDataBlockWithTags = response.substring(response.indexOf(WIDGET_START_TAG), endIndex + WIDGET_END_TAG.length);
        response = response.replace(fullDataBlockWithTags, fullHtmlWidget);
        
        return response;

    } catch (e) {
        console.error('Phannie Widget Error:', e);
        // Si hay error en los datos, muestra un mensaje de error simple
        return response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '<div style="color: red; font-weight: bold; padding: 10px;">[ERROR DE WIDGET: Revisa si el bot generó el formato de datos correctamente]</div>');
    }
}

// Registra la función con SillyTavern
extension.on('onMessageGeneration', postGenerationCallback);
