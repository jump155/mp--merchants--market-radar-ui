{{- define "market_radar_management_front_resources" }}
resources:
   requests:
     cpu: {{ first (pluck .Values.global.env .Values.resources.market_radar_management_front.requests.cpu) | default .Values.resources.market_radar_management_front.requests.cpu._default | quote }}
     memory: {{ first (pluck .Values.global.env .Values.resources.market_radar_management_front.requests.memory) | default .Values.resources.market_radar_management_front.requests.memory._default | quote }}
   limits:
     cpu: {{ first (pluck .Values.global.env .Values.resources.market_radar_management_front.limits.cpu) | default .Values.resources.market_radar_management_front.limits.cpu._default | quote }}
     memory: {{ first (pluck .Values.global.env .Values.resources.market_radar_management_front.limits.memory) | default .Values.resources.market_radar_management_front.limits.memory._default | quote }}
{{- end }}
