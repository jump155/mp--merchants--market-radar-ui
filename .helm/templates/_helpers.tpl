{{- define "market_radar_ui_resources" }}
resources:
   requests:
     cpu: {{ first (pluck .Values.global.env .Values.resources.market_radar_ui.requests.cpu) | default .Values.resources.market_radar_ui.requests.cpu._default | quote }}
     memory: {{ first (pluck .Values.global.env .Values.resources.market_radar_ui.requests.memory) | default .Values.resources.market_radar_ui.requests.memory._default | quote }}
   limits:
     cpu: {{ first (pluck .Values.global.env .Values.resources.market_radar_ui.limits.cpu) | default .Values.resources.market_radar_ui.limits.cpu._default | quote }}
     memory: {{ first (pluck .Values.global.env .Values.resources.market_radar_ui.limits.memory) | default .Values.resources.market_radar_ui.limits.memory._default | quote }}
{{- end }}
