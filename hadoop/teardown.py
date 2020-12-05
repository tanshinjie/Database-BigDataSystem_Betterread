import boto3
import pprint as pp
from botocore.exceptions import ClientError

session = boto3.session.Session(
    aws_access_key_id="ASIAVMPMSHONBONKZGX7",
    aws_secret_access_key="SPt3U6ZMSFZ0jU94pyYvb21gSXBYkN/sYgIfkSmW",
    aws_session_token="FwoGZXIvYXdzEDUaDPucsn8EAsm4HRfdKyLNAfZyM4KHQ+wXAE8UDDD63sqLF3oKBz5uMKiCkA4MPcT7r2zSTUPYK935jCC8M5S4TfHdO8NCBtQNP1cRxesuN4xFzAdv09KWRnmeAnJt42ifWCB0S8XmcTFgfH5EwVYiPg+AeJqQzIc8uX0zcCaSyRpA/BxGlOiICCOrpsb6fQY8QU0ZGPUxXYXckHlE1mzjgrKUtUwawHU5uFXcnt0xNrspUulsuxMuvtNc2/9rxqrwrhzYn+0ksForDTqUM6Fvr51BiJ86jKD2dGuiSCcoxNKf/gUyLQWtE+C5PytMCQkbV3OBHO1wWO1XsUwe/4AVt/kBt0LwpYb3olGgiufnbODmYg==",
    region_name="us-east-1",
)
ec2 = session.client("ec2")
ec2_resource = session.resource("ec2")


def teardown(mode, **kwargs):
    try:
        if mode == "a":
            key_name = kwargs.get("key_name", None)
            instances = ec2_resource.instances.filter(
                Filters=[{"Name": "key-name", "Values": [key_name]}]
            )
            ids = [i.instance_id for i in instances]
            print(ids)
            # response = ec2.terminate_instances(InstanceIds=ids)
            # pp.pprint(response)
            # return response
        elif mode == "s":
            priv_ips = kwargs.get("priv_ips", None)
            print(type(priv_ips))

            instances = ec2_resource.instances.filter(
                Filters=[{"Name": "private-ip-address", "Values": priv_ips}]
            )
            ids = [i.instance_id for i in instances]
            print(ids)
            # pp.pprint(response)
            # response = ec2.terminate_instances(InstanceIds=ids)
            # return response
        else:
            print("Mode available: a - all, s - scale")

    except Exception as error:
        pp.pprint(error)


if __name__ == "__main__":
    teardown("a", key_name="")
