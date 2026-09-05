FROM debian:bullseye-slim

ARG REALM
ARG TRUST_PRINCIPAL
ARG CONFIG_DIR
ARG TRUST_REALM

EXPOSE 749 88

ENV DEBIAN_FRONTEND noninteractive
ENV SUPPORTED_ENCRYPTION_TYPES aes256-cts-hmac-sha1-96:normal
ENV KADMIN_PRINCIPAL kadmin/admin
ENV KADMIN_PASSWORD MITiys4K5

# deb.debian.org does not reliably serve the bullseye-security pool: it 404s
# on package files that its own index references. security.debian.org is the
# canonical host for that suite and serves them.
RUN sed -i 's|deb\.debian\.org/debian-security|security.debian.org/debian-security|g' \
      /etc/apt/sources.list

# The -qq implies --yes
RUN apt-get -qq update \
  && apt-get -qq install locales krb5-kdc krb5-admin-server \
  && apt-get -qq clean \
  && rm -rf /var/lib/apt/lists/*

RUN locale-gen "en_US.UTF-8"
RUN echo "LC_ALL=\"en_US.UTF-8\"" >> /etc/default/locale

COPY configure.sh /tmp/
RUN /tmp/configure.sh
COPY ${CONFIG_DIR}/add_principals.sh /tmp/
RUN /tmp/add_principals.sh

COPY init.sh /tmp/
CMD /tmp/init.sh
