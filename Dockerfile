FROM docker.elastic.co/kibana/kibana-oss:6.1.2
RUN /usr/share/kibana/bin/kibana-plugin install https://github.com/dashbase/dashbase-kibana-plugin/releases/download/v1.0.0-rc1/dashbase-6.1.2-v1.0.0-rc1.zip
