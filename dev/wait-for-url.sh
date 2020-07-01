wait_for_url() {
    echo "Testing $1"
    timeout -s TERM 5m bash -c \
    'while [[ "$(curl -s -o /dev/null -L -w ''%{http_code}'' ${0})" != "200" ]];\
    do echo "Waiting for ${0}" && sleep 2;\
    done' ${1}
    echo "READY!"
}
