package env

import (
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
	"gopkg.in/yaml.v2"
)

type Loader struct {
	mx  sync.RWMutex
	env Env
}

type Env struct {
	Hostname string `yaml:"hostname"`

	EnvT    string `yaml:"env"`
	Group   string `yaml:"group"`
	DC      string `yaml:"dc"`
	Region  string `yaml:"region"`
	Cluster string `yaml:"cluster"`
	Owner   string `yaml:"owner"`
}

type Environment struct {
	Name       string
	Service    string
	Cluster    string
	DataCenter string
}

const maxEnvFileSize = 1024 * 1024 * 16

func (l *Loader) Load() Env {
	l.mx.RLock()
	defer l.mx.RUnlock()
	return l.env
}

// if error return empty Env
func ListenEnvFile(filePath string) (_ *Loader, closeF func(), _ error) {
	l := &Loader{}
	emptyFunc := func() {}
	if filePath == "" {
		return l, emptyFunc, nil
	}
	l.env, _ = ReadEnvFile(filePath)
	log.Printf("read env file: %+v", l.env)
	w, err := fsnotify.NewWatcher()
	if err != nil {
		return l, emptyFunc, err
	}
	err = w.Add(filePath)
	if err != nil {
		return l, emptyFunc, err
	}
	go func() {
		for {
			var ok bool
			var err error
			select {
			case _, ok = <-w.Events:
			case err, ok = <-w.Errors:
			}
			if err != nil {
				log.Println("env watching error:", err.Error())
				time.Sleep(10 * time.Second)
				continue
			}
			if !ok {
				break
			}
			envYaml, err := ReadEnvFile(filePath)
			if err != nil {
				log.Println("env reading error:", err.Error())
				time.Sleep(10 * time.Second)
				continue
			}
			l.mx.Lock()
			l.env = envYaml
			l.mx.Unlock()
		}
	}()
	return l, func() {
		_ = w.Close()
	}, nil
}

func ReadEnvFile(filePath string) (Env, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return Env{}, fmt.Errorf("failed to open file: %w", err)
	}
	defer f.Close()
	limitReader := io.LimitReader(f, maxEnvFileSize)
	data, err := io.ReadAll(limitReader)
	if err != nil {
		return Env{}, fmt.Errorf("failed to read env file: %w", err)
	}
	env := Env{}
	err = yaml.Unmarshal(data, &env)
	if err != nil {
		return Env{}, fmt.Errorf("failed to unmarshal env: %w", err)
	}
	return env, nil
}

func ReadEnvironment(service string) Environment {
	res := Environment{
		Service: service,
	}
	envFilePath := "/etc/statshouse_env.yml"
	flag.Visit(func(f *flag.Flag) {
		switch f.Name {
		case "env-file-path":
			envFilePath = f.Value.String()
		case "statshouse-env":
			res.Name = f.Value.String()
		}
	})
	// environment file is optional, command line takes precedence over it
	if v, err := ReadEnvFile(envFilePath); err == nil {
		if res.Name == "" {
			res.Name = v.EnvT
		}
		res.Cluster = v.Cluster
		res.DataCenter = v.DC
	}
	return res
}
