# Stage to build the PrusaSlicer cli tool
FROM ubuntu:22.04 AS prusaslicer-build

RUN apt update

ARG DEBIAN_FRONTEND=noninteractive

# Build dependencies
RUN apt install  -y \
    git \
    build-essential \
    autoconf \
    cmake \
    locales \
    libdbus-1-dev \
    libglu1-mesa-dev \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    texinfo

# Install locales and set the locale to en_US.UTF-8 which is necessary to build
# PrusaSlicer without errors

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
    && locale-gen en_US.UTF-8 \
    && update-locale LANG=en_US.UTF-8

# Set environment variables for the locale
ENV LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8


ENV OPT_DIR=/opt
ENV PRUSA_SRC=${OPT_DIR}/PrusaSlicer
ENV PRUSA_BUILD=${PRUSA_SRC}/build
ENV PRUSA_DEPS=${PRUSA_SRC}/deps
ENV PRUSA_DEPS_BUILD=${PRUSA_DEPS}/build
ENV CMAKE_PREFIX=${PRUSA_DEPS_BUILD}/usr/local
ENV PRUSA_CMAKE_PREFIX=${PRUSA_DEPS_BUILD}/destdir/usr/local/

# Using a modified PrusaSlicer source code that just updates a dependency link
# to fix the build for version 2.9.1. There are no actual changes to the
# PrusaSlicer source code
ENV PRUSA_GIT=https://github.com/rknizzle/PrusaSlicer.git

# This is the branch of my PrusaSlicer fork with the fix -- but it is using PrusaSlicer version 2.9.1
ENV PRUSASLICER_VERSION=mpfr-fix

# Pull PrusaSlicer source code
RUN git clone ${PRUSA_GIT} ${PRUSA_SRC} && cd ${PRUSA_SRC} && git checkout ${PRUSASLICER_VERSION}

# Build dependencies

WORKDIR ${PRUSA_DEPS_BUILD}
RUN cmake ${PRUSA_DEPS} \
	-DDEP_WX_GTK3=ON
RUN make

# Build PrusaSlicer

WORKDIR ${PRUSA_BUILD}
RUN cmake .. \
	-DSLIC3R_STATIC=1 \
	-DSLIC3R_GTK=3 \
	-DSLIC3R_PCH=OFF \
	-DSLIC3R_WX_STABLE=ON \
	-DSLIC3R_GUI=no \
	-DCMAKE_PREFIX_PATH=${PRUSA_CMAKE_PREFIX}

RUN make -j1 && make install

FROM node:22-bookworm-slim as app

# Install only runtime dependencies
RUN apt update && apt install -y --no-install-recommends \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*  # Clean up APT cache

# Copy PrusaSlicer binary from build stage
COPY --from=prusaslicer-build /usr/local/bin/prusa-slicer /usr/local/bin/prusa-slicer

RUN node --version
RUN prusa-slicer --help-fff

CMD ["prusa-slicer", "--help-fff"]
