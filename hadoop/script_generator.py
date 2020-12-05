def generate_hosts(priv_ips, hosts_name):
    hosts = "localhost\t127.0.0.1\n"
    for i in range(len(hosts_name)):
        hosts += "{}\t{}\n".format(priv_ips[i], hosts_name[i])
    with open("./tmp/hosts", "w") as f:
        f.write(hosts)


def generate_disable_strict_host_ssh(hosts_name):
    sub_script = ""
    print(hosts_name)
    for i in hosts_name:
        sub_script += """sudo su -c "ssh -o 'StrictHostKeyChecking no' {} 'echo 1 > /dev/null'" hadoop\n""".format(
            i
        )
    script = """
#! /bin/bash
# this script is generated

echo Disabling StrictHostKeyChecking...

{}

echo Done.
""".format(
        sub_script
    )

    with open("./scripts/disable_strict_host_ssh.sh", "w+") as f:
        f.write(script)


def generate_distribute_hadoop(priv_ips):
    sub_script = ""
    for i in priv_ips:
        sub_script += (
            "sudo su -c 'scp ~/hadoop-3.3.0.tgz hadoop@{}:~/' hadoop\n".format(i)
        )

    script = """
#! /bin/bash
# this script is generated

echo Distributing hadoop to datanode...

{}

echo Done.
""".format(
        sub_script
    )

    with open("./scripts/distribute_hadoop.sh", "w+") as f:
        f.write(script)


def generate_append_workers(hosts_name):
    sub_script = ""
    for i in hosts_name:
        sub_script += "sudo su -c 'echo {} >> /opt/hadoop-3.3.0/etc/hadoop/workers' hadoop\n".format(
            i
        )
    script = """
#! /bin/bash
# this script is generated

echo Appending new datanode to workers...

{}

echo Done.
""".format(
        sub_script
    )

    with open("./scripts/append_workers.sh", "w+") as f:
        f.write(script)


def generate_hadoop_config(hosts_name):
    sub_script = ""
    for i in hosts_name:
        sub_script += (
            "sudo su -c 'echo {} >> ~/hadoop-3.3.0/etc/hadoop/workers' hadoop\n".format(
                i
            )
        )
    script = """
#! /bin/bash
# this script is generated

echo Adding configuration...

sudo su -c 'cat ./tmp/core-site.xml > ~/hadoop-3.3.0/etc/hadoop/core-site.xml' hadoop
sudo su -c 'cat ./tmp/hdfs-site.xml > ~/hadoop-3.3.0/etc/hadoop/hdfs-site.xml' hadoop
sudo su -c 'cat ./tmp/yarn-site.xml > ~/hadoop-3.3.0/etc/hadoop/yarn-site.xml' hadoop
sudo su -c 'cat ./tmp/mapred-site.xml > ~/hadoop-3.3.0/etc/hadoop/mapred-site.xml' hadoop

sudo su -c "rm ~/hadoop-3.3.0/etc/hadoop/workers" hadoop
{}

echo Done.
""".format(
        sub_script
    )

    with open("./scripts/setup_hadoop_config.sh", "w+") as f:
        f.write(script)
