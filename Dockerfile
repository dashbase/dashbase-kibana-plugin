FROM docker.elastic.co/kibana/kibana-oss:6.3.2

WORKDIR /usr/share/kibana
ADD build/dashbase-0.0.0.zip .
COPY kibana-docker /usr/local/bin/kibana-docker
USER root
RUN chmod +x /usr/local/bin/kibana-docker && kibana-plugin install file:///usr/share/kibana/dashbase-0.0.0.zip
USER kibana
