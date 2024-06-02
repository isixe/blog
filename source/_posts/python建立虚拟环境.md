---
title: "Python 建立虚拟环境"
date: 2022-02-03
categories: 编程
tags: [Python]
---

Python 有三种方法可以创建虚拟环境

1. virtualenv + virtualenvwrapper
2. pipenv
3. conda

## Virtualenv

virtualenv 是一个用于创建隔离的 Python 环境的工具，它创建一个具有自己的安装目录的环境，该环境不与其他 virtualenv 环境共享库

切换项目时，只需创建一个新的虚拟环境，而不必担心破坏其他环境中安装的包。始终建议在开发 Python 应用程序时使用虚拟环境

> pip install virtualenv

在 python 中 venv 命令允许您管理不同项目的单独软件包安装。它们基本上允许您创建一个"虚拟"隔离的 Python 安装，并将软件包安装到该虚拟环境中，当虚拟环境创建时，会在文件下生成一个虚拟环境的目录

| Unix / MacOS 命令                 | Windows 命令                      | 说明                         |
| :-------------------------------- | :-------------------------------- | :--------------------------- |
| python3 \-m venv venv             | py \-m venv venv                  | 创建虚拟环境\+环境名         |
| source env/bin/activate           | \.\\venv\\Scripts\\activate       | 激活启动虚拟环境             |
| deactivate                        | deactivate                        | 退出虚拟环境                 |
| pip freeze                        | pip freeze                        | 查看所有当前安装库的版本     |
| pip freeze > requirements\.txt    | pip freeze > requirements\.txt    | 导出为安装库版本为文本文件   |
| pip install \-r requirements\.txt | pip install \-r requirements\.txt | 根据导出的安装库文本进行安装 |
| virtualenv \-h                    | virtualenv \-h                    | 查看 virtualenv 库的命令帮助 |

## virtualenvwrapper

virtualenvwrapper 是 virtualenv 库的一组扩展库。这些扩展包括用于创建和删除虚拟环境以及以其他方式管理开发工作流的包装器，从而可以更轻松地一次处理多个项目，而不会在其依赖项中引入冲突
<br>

- Unix / MacOS

  > pip install virtualenvwrapper

- Windows
  > pip install virtualenvwrapper-win

virtualenvwrapper 提供了以下几种功能：

1. 将所有虚拟环境组织到一个位置。
2. 用于创建、复制和删除环境的包装器，包括用户可配置的挂钩。
3. 使用单个命令在环境之间切换。
4. 用户可配置的挂钩，用于所有操作。
5. 插件系统，用于更多创建可共享的扩展。

| 命令              | 说明                               |
| :---------------- | :--------------------------------- |
| mkvirtualenv venv | 创建虚拟环境                       |
| workon            | 查看当前的虚拟环境目录             |
| workon venv       | 切换到虚拟环境                     |
| deactivate        | 退出虚拟环境                       |
| rmvirtualenv venv | 删除虚拟环境                       |
| cdvirtualenv      | 进入虚拟环境目录                   |
| cdsitepackages    | 进入虚拟环境的 site\-packages 目录 |
| lssitepackages    | 列出当前环境安装了的包             |
| mkproject mic     | 创建 mic 项目和运行环境 mic        |
| mktmpenv          | 创建临时运行环境                   |

Windows 创建的虚拟环境统一存放在 C:\Users\<Username>\Evns 目录下

## pipenv

Pipenv 是一个生产就绪的工具，它将 Pipfile，pip 和 virtualenv 整合到一个命令中，弥补了 virtuanenv 的缺陷，并且可以管理和创建 virtualenv 的虚拟环境

> pip install pipenv

Pipenv 使用以下命令创建和管理虚拟环境，当虚拟环境不存在时，将自动创建一个虚拟环境，

| 命令                               | 说明                                                                                                   |
| :--------------------------------- | :----------------------------------------------------------------------------------------------------- |
| pipenv install                     | 建立一个 virtualenv 虚拟环境                                                                           |
| pipenv shell                       | 激活一个 virtualenv 虚拟环境，如果不存在虚拟环境，将生成一个新的 virtualenv 虚拟环境                   |
| pipenv graph                       | 按照树形结构显示当前环境的依赖关系和版本                                                               |
| pipenv run                         | 将从 virtualenv 运行给定的命令，并转发任何参数<br>例如：<br>pipenv run python<br>pipenv run pip freeze |
| pipenv check                       | 检查安全漏洞，并断言当前环境是否满足 PEP 508 要求                                                      |
| lsvirtualenv                       | 查看虚拟环境列表                                                                                       |
| pipenv update                      | 更新所有库的版本                                                                                       |
| pipenv lock                        | 锁定当前环境的依赖版本                                                                                 |
| pipenv sync                        | 安装 Pipfile.lock 中指定的所有的包                                                                     |
| pipenv clean                       | 卸载所有 Pipfile.lock 未指定的包                                                                       |
| pipenv open                        | 在编辑器中查看给定的模块                                                                               |
| pipenv lock -r > requirements.txt  | 导出为安装库版本为文本文件                                                                             |
| pip install -r requirements.txt    | 通过 pip 导入 requirements 的库                                                                        |
| pipenv install -r requirements.txt | 通过 pipenv 导入 requirements 的库                                                                     |
| exit                               | 退出虚拟环境                                                                                           |

**注**

在 windows 下，虚拟环境文件夹会在 C：\Users\Administrator.virtualenvs\目录下默认创建，我们可以使用以下方法自定义虚拟环境文件的目录

1. 设置这个环境变量，pipenv 会在当前目录下创建.venv 的目录，以后都会把模块装到这个.venv 下。

   export PIPENV_VENV_IN_PROJECT=1

2. 自己在项目目录下手动创建.venv 的目录，然后运行 pipenv run 或者 pipenv shell pipenv 都会在.venv 下创建虚拟环境

   mkdir .venv
   pipenv shell

3. 设置 WORKON_HOME 到其他的地方 （如果当前目录下已经有.venv,此项设置失效）

   export WORKON_HOME=$HOME/.virtualenvs

Pipenv 还提供了使用额外的参数，辅助以上命令使用：

| 命令参数              | 描述                                                                 |
| :-------------------- | :------------------------------------------------------------------- |
| \-\-where             | 输出项目根目录相关信息                                               |
| \-\-venv              | 输出 virtualenv 相关信息                                             |
| \-\-py                | 输出 Python 解释器相关信息                                           |
| \-\-envs              | 输出环境变量选项                                                     |
| \-\-rm                | 删除 virtualenv                                                      |
| \-\-bare              | 最小化输出                                                           |
| \-\-completion        | 命令自动补全                                                         |
| \-\-man               | 显示 man 页面                                                        |
| \-\-python TEXT       | 指定创建 virtualenv 时使用的具体的 Python 版本                       |
| \-\-site\-packages    | 为 virtualenv 启用 site\-packages \[env 变量：PIPENV_SITE_PACKAGES\] |
| \-\-clear             | 清除缓存（pipenv，pip 和 pip\-tools）\[env 变量：PIPENV_CLEAR\]      |
| \-\-pypi\-mirror TEXT | 指定一个 PyPI 镜像                                                   |
| \-\-version           | 显示版本信息并退出                                                   |
| \-h<br>\-help         | 显示帮助信息并退出                                                   |

初始化好虚拟环境后，会在项目目录下生成 2 个文件 Pipfile 和 Pipfile.lock。为 pipenv 包的配置文件，代替原来的 requirement.txt。项目提交时，可将 Pipfile 文件和 Pipfile.lock 文件受控提交,待其他开发克隆下载，根据此 Pipfile 运行命令 pipenv install [--dev]生成自己的虚拟环境

## Conda

Conda 是一个开源的包、环境管理器，可以用于在同一个机器上安装不同版本的软件包及其依赖，并能够在不同的环境之间切换。

> conda create -n venv python=3.7
> <br>conda create --name venv python=3.7

Conda 在 anaconda 文件下指定了一个虚拟环境的目录 envs,直接运行命令即可创建虚拟环境

| 命令                                                                                  | 描述                                                       |
| :------------------------------------------------------------------------------------ | :--------------------------------------------------------- |
| activate                                                                              | 切换到 base 环境                                           |
| activate venv                                                                         | 激活启动虚拟环境                                           |
| conda env list<br>conda info -e                                                       | 查看创建的所有虚拟环境                                     |
| conda remove --name venv --all                                                        | 删除创建的虚拟环境                                         |
| conda list -e > condalist.txt <br> pip freeze > requirements.txt                      | 导出当前环境安装的所有库的 txt 文件                        |
| conda env export > environment.yaml                                                   | 导出当前环境安装的所有库的 yaml 文件                       |
| conda install --yes --file condalist.txt <br> pip install -r requirements.txt         | 根据导出的 txt 文件安装库                                  |
| conda env create -f environment.yaml                                                  | 在创建虚拟环境时，同时安装 environment.yaml 文件中的所有库 |
| deactivate                                                                            | 退出虚拟环境                                               |
| conda install [package]                                                               | 安装需要的库                                               |
| conda update                                                                          | 更新虚拟环境中的库到最新版本                               |
| conda update [package]                                                                | 更新安装的库                                               |
| conda update conda                                                                    | 检查更新 conda                                             |
| conda info --envs                                                                     | 查看虚拟环境及其他信息                                     |
| conda create --name new_name --clone old_name <br> conda remove --name old_name --all | 克隆旧的虚拟环境到新的虚拟环境中，再删除旧的虚拟环境       |
