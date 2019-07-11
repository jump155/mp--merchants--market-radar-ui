{{- define "market_radar_management_front_envs" }}
- name: VUE_APP_URL_API
  value: {{ pluck .Values.global.env .Values.app.market_radar_management_front.url_api | first | default .Values.app.market_radar_management_front.url_api._default | quote }}
- name: NODE_EXTRA_CA_CERTS
  value: {{ pluck .Values.global.env .Values.app.market_radar_management_front.node_extra_ca_certs | first | default .Values.app.market_radar_management_front.node_extra_ca_certs._default | quote }}
- name: LOG_LEVEL
  value: {{ pluck .Values.global.env .Values.app.market_radar_management_front.log_level | first | default .Values.app.market_radar_management_front.log_level._default | quote }}
- name: REST_PORT
  value: {{ pluck .Values.global.env .Values.app.market_radar_management_front.rest_port | first | default .Values.app.market_radar_management_front.rest_port._default | quote }}
{{- end }}
